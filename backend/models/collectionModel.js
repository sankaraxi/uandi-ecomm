const pool = require('../config/database');


const collectionModel = {
    getAllCollections: async () => {
        const [rows] = await pool.query('SELECT * FROM collections');
        return rows;
    },

    addCollection: async (collection_name) => {
        const sql = `
            INSERT INTO collections (collection_name, is_active)
            VALUES (?, 1)
        `;

        const [result] = await pool.query(sql, [collection_name]);

        return result;
    },

    addProductsToCollection: async (collection_id, product_ids = []) => {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            if (!Array.isArray(product_ids) || product_ids.length === 0) {
                throw new Error("No products provided");
            }

            // Get current max sort_order for this collection
            const [existing] = await conn.query(
                "SELECT sort_order FROM collection_products WHERE collection_id = ? ORDER BY sort_order DESC LIMIT 1",
                [collection_id]
            );

            let startOrder = existing.length > 0 ? existing[0].sort_order + 1 : 1;

            const insertSQL = `
            INSERT INTO collection_products (collection_id, product_id, sort_order)
            VALUES (?, ?, ?)
        `;

            // Insert each product
            for (let i = 0; i < product_ids.length; i++) {
                await conn.query(insertSQL, [
                    collection_id,
                    product_ids[i],
                    startOrder + i,
                ]);
            }

            await conn.commit();

            return {
                success: true,
                message: "Products mapped to collection successfully",
                collection_id,
                product_ids
            };

        } catch (error) {
            await conn.rollback();
            console.error("Error mapping products:", error);
            throw error;
        } finally {
            conn.release();
        }
    },

    getCollectionWithProducts: async (collection_id) => {
        try {
            // 1️⃣ Get collection info
            const [collectionRows] = await pool.query(
                `SELECT * FROM collections WHERE collection_id = ?`,
                [collection_id]
            );
            if (collectionRows.length === 0) {
                throw new Error("Collection not found");
            }

            // 2️⃣ Fetch products + variants + main image + category
            const [productsRaw] = await pool.query(
                `SELECT
                     cp.product_id,
                     cp.sort_order,
                     p.product_name,
                     p.description,
                     p.is_active,
                     img.image_url AS main_image,
                     c.category_name,
                     v.variant_id,
                     v.variant_name,
                     v.price AS variant_price,
                     v.final_price,
                     v.stock
                 FROM collection_products cp
                     INNER JOIN products p ON cp.product_id = p.product_id
                     LEFT JOIN categories c ON p.category_id = c.category_id
                     LEFT JOIN product_images img ON img.product_id = p.product_id AND img.is_main = 1
                     LEFT JOIN variants v ON p.product_id = v.product_id
                 WHERE cp.collection_id = ? AND p.is_active = 1
                 ORDER BY cp.sort_order ASC, p.product_id ASC, v.variant_id ASC`,
                [collection_id]
            );

            // 3️⃣ Group variants per product
            const groupedProducts = productsRaw.reduce((acc, row) => {
                const {
                    product_id,
                    product_name,
                    description,
                    main_image,
                    is_active,
                    sort_order,
                    category_name,
                    variant_id,
                    variant_name,
                    variant_price,
                    final_price,
                    stock
                } = row;

                let product = acc.find(p => p.product_id === product_id);
                if (!product) {
                    product = {
                        product_id,
                        product_name,
                        description,
                        main_image,
                        is_active,
                        sort_order,
                        category: category_name ? { category_name } : null,
                        variants: []
                    };
                    acc.push(product);
                }
                if (variant_id) {
                    product.variants.push({
                        variant_id,
                        variant_name,
                        price: variant_price,
                        final_price,
                        stock,
                        images: [] // will be filled later
                    });
                }
                return acc;
            }, []);

            // 4️⃣ Collect all variant IDs for image fetch
            const allVariantIds = groupedProducts.flatMap(p => p.variants.map(v => v.variant_id));
            if (allVariantIds.length > 0) {
                const [variantImages] = await pool.query(
                    `SELECT image_id, image_url, is_main, is_video, variant_id, product_id
                     FROM product_images
                     WHERE variant_id IN (${allVariantIds.map(() => '?').join(',')})
                     ORDER BY image_id ASC`,
                    allVariantIds
                );

                // 5️⃣ Attach images to matching variants
                groupedProducts.forEach(prod => {
                    prod.variants.forEach(variant => {
                        const imgs = variantImages.filter(img => img.variant_id === variant.variant_id && !img.is_video);
                        variant.images = imgs.map(i => ({ image_url: i.image_url }));
                    });
                    // Ensure first variant has at least main_image
                    if (prod.variants[0] && prod.main_image) {
                        const hasMain = prod.variants[0].images.some(img => img.image_url === prod.main_image);
                        if (!hasMain) {
                            prod.variants[0].images.unshift({ image_url: prod.main_image });
                        }
                    }
                });
            }

            return {
                success: true,
                collection: collectionRows[0],
                products: groupedProducts
            };
        } catch (error) {
            console.error("Error fetching collection data:", error);
            throw error;
        }
    },

    updateCollectionOrders: async (collection_id, updateOrder) => {
        try {
            const ids = updateOrder.map(i => i.product_id);
            const caseStatements = updateOrder
                .map(item => `WHEN product_id = ${item.product_id} THEN ${item.sort_order}`)
                .join(" ");

            const sql = `
            UPDATE collection_products
            SET sort_order = CASE ${caseStatements} END
            WHERE collection_id = ?
            AND product_id IN (${ids.join(",")});
        `;

            await pool.query(sql, [collection_id]);

            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false };
        }
    }


};

module.exports = collectionModel;
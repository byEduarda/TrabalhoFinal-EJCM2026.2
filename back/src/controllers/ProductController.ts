import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class ProductController {
    static async create(req: Request, res: Response) {
        try {
            const { name, description, price, rating,categoryId } = req.body;

            const newProduct = await prisma.product.create({
                data: {
                    name :name,
                    description: description ,
                    price: price,
                    rating:rating,
                    categoryId
                },
            });

            return res.status(201).json(newProduct);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao criar produto" });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await prisma.product.findUnique({
                where: { id }
            });

            if (!product) {
                return res.status(404).json({ error: "Produto não encontrado" });
            }

            return res.json(product);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar produto" });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description, price, rating } = req.body;

            const updatedProduct = await prisma.product.update({
                where: { id },
                data: {
                    ...(name && { name }),
                    ...(description && { description }),
                    ...(price && { price }),
                    ...(rating !== undefined && { rating })
                }
            });

            return res.json(updatedProduct);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao atualizar produto" });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.product.delete({
                where: { id }
            });

            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao deletar produto" });
        }
    }
}

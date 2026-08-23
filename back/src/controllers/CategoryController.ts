// controllers/CategoryController.ts
import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class CategoryController {
    static async create(req: Request, res: Response) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Nome é obrigatório' });
            }

            const existing = await prisma.category.findUnique({ 
                where: { name } 
            });

            if (existing) {
                return res.status(200).json(existing);
            }

            const newCategory = await prisma.category.create({
                data: { name }
            });

            return res.status(201).json(newCategory);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar categoria' });
        }
    }

    static async getAll(_req: Request, res: Response) {
        try {
            const categories = await prisma.category.findMany();
            return res.json(categories);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar categorias' });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const category = await prisma.category.findUnique({
                where: { id }
            });

            if (!category) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            return res.json(category);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar categoria' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const updatedCategory = await prisma.category.update({ 
                where: { id }, 
                data: { name } 
            });      

            return res.json(updatedCategory);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ error: 'Erro ao atualizar categoria' });
        }
    }

    static async remove(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const category = await prisma.category.findUnique({ 
                where: { id } 
            });

            if (!category) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            await prisma.category.delete({ 
                where: { id } 
            });

            return res.status(200).json({ message: 'Categoria removida' });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ error: 'Erro ao remover categoria' });
        }
    }
}
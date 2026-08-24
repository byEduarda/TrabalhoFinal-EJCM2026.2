import { Request, Response } from 'express';
import { prisma } from '../config/prisma';


export class CategoryController {
    static async create(req: Request, res: Response){
        try{
            const {name} = req.body;

            const newCategory = await prisma.category.create({
                data:{
                    name
                }
            });
            return res.status(201).json(newCategory);
        }catch(error){
             console.error(error);
            return res.status(500).json({ 
                error: 'Erro ao criar item do carrinho' 
            });
        }
    }
}
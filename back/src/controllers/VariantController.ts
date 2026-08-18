import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

//DEIXEI O ERRO ESPECÍFICO PARA FAZERMOS OS TESTES, MAS NO FINAL PRECISAMOS TROCAR PARA GENÉRICOS!

export class VariantController {

    static async create(req: Request, res: Response){
        try{
            const {size, color, stockQuantity, productId} = req.body;

            const newVariant = await prisma.variant.create({
                data: {
                    size,
                    color,
                    stockQuantity,
                    productId
                }
            });
            return res.status(201).json(newVariant);
        }
        catch (error:any){
            console.error(error);
            return res.status(500).json({ error:error.message });
        }
    }
    
    static async getById(req:Request, res:Response){
        try{
            const {id} = req.params;

            const variant = await prisma.variant.findUnique({
                where: {id}
            });

            if (!variant) {
                return res.status(404).json({ error: "Variação do produto não encontrada" });
            }

            return res.status(200).json(variant);
        }
        catch (error:any){
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async update(req:Request, res:Response){
        try{
            const {id} = req.params;
            const {size, color, stockQuantity} = req.body;

            const updatedVariant = await prisma.variant.update({
                where: {
                    id: id,
                },
                data: {
                    size: size,
                    color: color,
                    stockQuantity: stockQuantity,
                    }
                });

            return res.status(200).json(updatedVariant);
        }
        catch (error:any){
            if (error.code === "P2025"){
                return res.status(404).json({message: "Variação do produto não encontrada"})
            }
            console.error(error);
        return res.status(500).json({message: error.message});

        }
    }

    static async delete(req:Request, res:Response){
        try{
            const {id} = req.params;

            const deletedVariant=await prisma.variant.delete({
                where: {id}
            });
            return res.status(200).json(deletedVariant);
        }
        catch (error:any){
            if(error.code === "P2025"){
                return res.status(404).json({message: "Variação do produto não encontrada"})
            }
            console.error(error);
            res.status(500).json({message: error.message});
        }
    }
}

import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

//DEIXEI O ERRO ESPECÍFICO PARA FAZERMOS OS TESTES, MAS NO FINAL PRECISAMOS TROCAR PARA GENÉRICOS!

export class VariantController {

    static async create(req: Request, res: Response){
        try{
            const {size, color, stockQuantity, productId} = req.body;

            const newVariant = await prisma.ProductVariant.create({
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

            const variant = await prisma.ProductVariant.findUnique({
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

    static async getVariantByProduct(req:Request, res:Response){
        try{
            const {productId} = req.params;

            const productVariants = await prisma.ProductVariant.findMany({
                where: {productId}
            });

            if (productVariants.length === 0){
                return res.status(404).json({ error: "Variações do produto não encontradas"});
            }

            return res.status(200).json(productVariants);
        }
        catch(error:any){
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async update(req:Request, res:Response){
        try{
            const {id} = req.params;
            const {size, color, stockQuantity} = req.body;

            const updatedVariant = await prisma.ProductVariant.update({
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

    static async updateStock(req: Request, res:Response){
        try{
            const {id} = req.params;
            const {quantityToAdd}=req.body;

            if (typeof quantityToAdd !== 'number') {
                return res.status(400).json({ error: "quantityToAdd deve ser um número" });
            }

            const updatedStock = await prisma.ProductVariant.update({
                where: {
                    id: id
                },
                data:{
                    stockQuantity: {increment:quantityToAdd}
                }
            });
            return res.status(200).json(updatedStock);
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

            const deletedVariant=await prisma.ProductVariant.delete({
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

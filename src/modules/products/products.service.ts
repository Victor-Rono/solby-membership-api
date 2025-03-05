/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ProductInterface, StockRemovalInterface, UnsoldProductInterface } from 'src/shared/interfaces/product.interface';
import { createNotification } from 'src/shared/functions/notifications.functions';
import { CreateRequestInterface, DatabaseCollectionEnums, DBRequestInterface } from 'src/database/database.interface';
import { BaseService } from 'src/modules/base/base.service';
import { generateUniqueId } from 'src/database/database.functions';
import { resolveMultiplePromises } from 'victor-dev-toolbox';
import { OrganizationInterface } from 'src/shared/interfaces/organization.interface';

@Injectable()
export class ProductsService extends BaseService<any, any, any, any> {
    collection: DatabaseCollectionEnums = DatabaseCollectionEnums.PRODUCTS;
    constructor() {
        super();
    }





    // Add Product
    override async create(payload: CreateRequestInterface) {
        const { organizationId, payload: Product } = payload;
        return new Promise<any>(async (resolve, reject) => {
            const ProductsWithSimilarName = await this.getByField(
                {
                    payload: { field: 'name', value: Product.name },
                    organizationId,
                }
            );
            if (ProductsWithSimilarName.length) {
                const notification = createNotification(
                    'error',
                    `${Product.name} already exists`,
                );
                resolve({ notification });
                return;
            }
            const id = Product.id || generateUniqueId();
            super.create({ id, payload: Product, organizationId })
                .then((res) => {
                    const notification = createNotification(
                        'success',
                        'Product Added Successfully',
                    );
                    res.notification = notification;
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    async getUserDetails(data: { organizationId: string, payload: { email: string } }) {
        const { organizationId, payload } = data;

        const users = await this.databaseService.getItemsByField({ organizationId, field: 'email', value: payload.email, collection: DatabaseCollectionEnums.USERS });
        const user = users[0] || null;
        return user;

    }

    async updateProductQuantity(organizationId: string,
        id: string,
        Product: { quantity: number }) {
        return new Promise<ProductInterface | null>(async (resolve, reject) => {
            const product = await this.getById({ organizationId, id });
            const quantity = product.quantity + Product.quantity;
            const newQuantity = quantity + (Product.quantity + 0);

            const update = await this.update({ organizationId, id, payload: { quantity: newQuantity } });
            resolve(update);
        });
    }

    async recordUnsoldProducts() {
        const organizations: OrganizationInterface[] = await this.databaseService.getAllItems({ organizationId: '', collection: DatabaseCollectionEnums.ORGANIZATIONS });
        const promises: Promise<any>[] = [];
        organizations.forEach(organization => {
            promises.push(this.saveUnsoldProducts(organization.id));
        });
        const result = await resolveMultiplePromises(promises);
        return result;
    }

    private async saveUnsoldProducts(organizationId: string) {
        const markUnsoldProductsAsInactive = await this.markUnsoldProductsAsInactive(organizationId);
        const products = await this.databaseService.getAllItems({ organizationId, collection: DatabaseCollectionEnums.PRODUCTS });
        const filteredProducts = products.filter(p => p.quantity > 0);
        const promises: Promise<any>[] = [];
        filteredProducts.forEach(product => {
            const unsoldProduct: UnsoldProductInterface = {
                productId: product.id,
                status: 'Active',
                name: product.name,
                quantity: product.quantity,
                createdAt: new Date().toISOString(),
            };
            promises.push(this.databaseService.createItem({ id: generateUniqueId(), organizationId, itemDto: unsoldProduct, collection: DatabaseCollectionEnums.UNSOLD_PRODUCTS }));
        });
        const results = await resolveMultiplePromises(promises);
        return results;
    }

    private async markUnsoldProductsAsInactive(organizationId: string) {
        const unsoldProducts: UnsoldProductInterface[] = await this.databaseService.getItemsByField({ organizationId, field: 'status', value: 'Active', collection: DatabaseCollectionEnums.UNSOLD_PRODUCTS });
        const promises: Promise<any>[] = [];
        unsoldProducts.forEach(product => {
            if (!product.id) return;
            promises.push(this.databaseService.updateItem({ organizationId, id: product.id, itemDto: { status: 'Closed' }, collection: DatabaseCollectionEnums.UNSOLD_PRODUCTS }));
        });
        const results = await resolveMultiplePromises(promises);
        return results;
    }

    async stockRemoval(data: DBRequestInterface) {
        const { organizationId } = data;
        const payload: StockRemovalInterface = data.payload;
        const { productId, quantity, reason } = payload;
        const product = await this.getById({ organizationId, id: productId });
        const updatedQuantity = product.quantity - quantity;
        if (updatedQuantity < 0) {
            throw new Error('Cannot deduct more than what is in stock');
        };
        const update = await this.update({ organizationId, id: productId, payload: { quantity: updatedQuantity } });
        // save to stock removal
        const save = await this.databaseService.createItem({ id: generateUniqueId(), organizationId, itemDto: { productId, quantity, reason }, collection: DatabaseCollectionEnums.STOCK_REMOVAL });
        return update;
    }

    override async deleteRecord(data: DBRequestInterface) {
        const { organizationId, id, payload } = data;
        // if (id === 'milk') return;
        const deleted = await super.deleteRecord(data);
        // const update = await this.databaseService.deleteItem({ organizationId, id, itemDto: payload, collection: DatabaseCollectionEnums.PRODUCTS });
        return deleted;
    }



}



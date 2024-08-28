import { ProductImageInsert } from '../../../src/dtos/products/updateProduct.dto'; import { Request, Response } from "express";
import { ProductController } from "../../../src/controller/ProductController";
import { ProductBusiness } from "../../../src/business/ProductBusiness";
import { CreateProductInputDTO } from "../../../src/dtos/products/createProduct.dto";
import { UpdateProductInputDTO } from "../../../src/dtos/products/updateProduct.dto";
import ErrorHandler from "../../../src/errors/ErrorHandler";
import logger from "../../../src/logs/logger";

const mockProductBusiness = {
  createProduct: jest.fn(),
  editProduct: jest.fn(),
  insertProductImage: jest.fn(),
  deleteProductImage: jest.fn(),
  getProducts: jest.fn(),
  toggleProductActiveStatus: jest.fn(),
};

const productController = new ProductController(
  mockProductBusiness as unknown as ProductBusiness
);

jest.mock("../../../src/logs/logger", () => ({
  error: jest.fn(),
}));

jest.mock("../../../src/errors/ErrorHandler", () => ({
  handleError: jest.fn(),
}));

describe("ProductController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // --------------------------------------------------------------------

  // test("should successfully create a product", async () => {
  //   const input: CreateProductInputDTO = {
  //     name: "Product Name",
  //     description: "Product Description",
  //     price: 100,
  //     stock: 50,
  //     category_id: 1,
  //     color_id: 2,
  //     size_id: 3,
  //     gender_id: 4,
  //     images: [
  //       {
  //         product_id: "product_id",
  //         url: "http://example.com/image1.jpg",
  //         alt: "Image 1",
  //       },
  //       {
  //         product_id: "product_id",
  //         url: "http://example.com/image2.jpg",
  //         alt: "Image 2",
  //       },
  //     ],
  //   };

  //   req.body = input;

  //   mockProductBusiness.createProduct.mockResolvedValue({
  //     message: "Product created successfully",
  //     product: {
  //       id: "product_id",
  //       name: "Product Name",
  //       description: "Product Description",
  //       price: 100,
  //       stock: 50,
  //       category_id: 1,
  //       color_id: 2,
  //       size_id: 3,
  //       gender_id: 4,
  //       images: [
  //         {
  //           product_id: "product_id",
  //           url: "http://example.com/image1.jpg",
  //           alt: "Image 1",
  //         },
  //         {
  //           product_id: "product_id",
  //           url: "http://example.com/image2.jpg",
  //           alt: "Image 2",
  //         },
  //       ],
  //     },
  //   });

  //   await productController.createProduct(req as Request, res as Response);

  //   expect(mockProductBusiness.createProduct).toHaveBeenCalledWith({
  //     name: "Product Name",
  //     description: "Product Description",
  //     price: 100,
  //     stock: 50,
  //     category_id: 1,
  //     color_id: 2,
  //     size_id: 3,
  //     gender_id: 4,
  //     images: [
  //       {
  //         product_id: "product_id",
  //         url: "http://example.com/image1.jpg",
  //         alt: "Image 1",
  //       },
  //       {
  //         product_id: "product_id",
  //         url: "http://example.com/image2.jpg",
  //         alt: "Image 2",
  //       },
  //     ],
  //   });
  //   expect(res.status).toHaveBeenCalledWith(201);
  //   expect(res.send).toHaveBeenCalledWith({
  //     message: "Product created successfully",
  //     product: {
  //       id: "product_id",
  //       name: "Product Name",
  //       description: "Product Description",
  //       price: 100,
  //       stock: 50,
  //       category_id: 1,
  //       color_id: 2,
  //       size_id: 3,
  //       gender_id: 4,
  //       images: [
  //         {
  //           product_id: "product_id",
  //           url: "http://example.com/image1.jpg",
  //           alt: "Image 1",
  //         },
  //         {
  //           product_id: "product_id",
  //           url: "http://example.com/image2.jpg",
  //           alt: "Image 2",
  //         },
  //       ],
  //     },
  //   });
  // });

  // --------------------------------------------------------------------

  test("should handle errors properly in createProduct", async () => {
    const error = new Error("Validation Error");

    req.body = {
      name: "Product Name",
      description: "Product Description",
      price: 100,
      stock: 50,
      category_id: 1,
      color_id: 2,
      size_id: 3,
      gender_id: 4,
      images: [
        {
          product_id: "product_id",
          url: "http://example.com/image1.jpg",
          alt: "Image 1",
        },
      ],
    };

    mockProductBusiness.createProduct.mockRejectedValue(error);

    await productController.createProduct(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // --------------------------------------------------------------------

  test("should successfully edit a product", async () => {
    const input: UpdateProductInputDTO = {
      id: "product_id",
      name: "Updated Product Name",
      description: "Updated Product Description",
      price: 120,
      stock: 60,
      category_id: 2,
      color_id: 3,
      size_id: 4,
      gender_id: 5,
    };

    req.params = { id: "product_id" };
    req.body = input;

    mockProductBusiness.editProduct.mockResolvedValue({
      message: "Product updated successfully",
    });

    await productController.editProduct(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Product updated successfully",
    });
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in editProduct", async () => {
    const error = new Error("Error Updating Product");

    req.params = { id: "product_id" };
    req.body = {
      name: "Updated Product Name",
      description: "Updated Product Description",
      price: 120,
      stock: 60,
      category_id: 2,
      color_id: 3,
      size_id: 4,
      gender_id: 5,
    };

    mockProductBusiness.editProduct.mockRejectedValue(error);

    await productController.editProduct(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // --------------------------------------------------------------------

  test("should successfully insert a product image", async () => {
    const input = {
      product_id: "product_id",
      url: "http://example.com/image3.jpg",
      alt: "Image 3",
    };

    req.params = { id: "product_id" };
    req.body = input;

    mockProductBusiness.insertProductImage.mockResolvedValue({
      message: "Product image inserted successfully",
    });

    await productController.insertProductImage(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Product image inserted successfully",
    });
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in insertProductImage", async () => {
    const error = new Error("Error Inserting Product Image");

    req.params = { id: "product_id" };
    req.body = {
      url: "http://example.com/image3.jpg",
      alt: "Image 3",
    };

    mockProductBusiness.insertProductImage.mockRejectedValue(error);

    await productController.insertProductImage(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // --------------------------------------------------------------------

  test("should successfully delete a product image", async () => {
    const imageId = "image_id";

    req.params = { id: imageId };

    mockProductBusiness.deleteProductImage.mockResolvedValue({
      message: "Product image deleted successfully",
    });

    await productController.deleteProductImage(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Product image deleted successfully",
    });
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in deleteProductImage", async () => {
    const error = new Error("Error Deleting Product Image");

    req.params = { id: "image_id" };

    mockProductBusiness.deleteProductImage.mockRejectedValue(error);

    await productController.deleteProductImage(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // --------------------------------------------------------------------

  test("should successfully get products", async () => {
    const products = [
      {
        id: "product_id_1",
        name: "Product 1",
        description: "Description 1",
        price: 100,
        stock: 50,
        category_id: 1,
        color_id: 2,
        size_id: 3,
        gender_id: 4,
      },
      {
        id: "product_id_2",
        name: "Product 2",
        description: "Description 2",
        price: 150,
        stock: 30,
        category_id: 2,
        color_id: 3,
        size_id: 4,
        gender_id: 5,
      },
    ];

    mockProductBusiness.getProducts.mockResolvedValue(products);

    await productController.getProducts(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(products);
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in getProducts", async () => {
    const error = new Error("Error Getting Products");

    mockProductBusiness.getProducts.mockRejectedValue(error);

    await productController.getProducts(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // --------------------------------------------------------------------

  test("should successfully toggle product active status", async () => {
    const productId = "product_id";

    req.params = { id: productId };

    mockProductBusiness.toggleProductActiveStatus.mockResolvedValue({
      message: "Product active status toggled successfully",
    });

    await productController.toggleProductActiveStatus(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Product active status toggled successfully",
    });
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in toggleProductActiveStatus", async () => {
    const error = new Error("Error Toggling Product Active Status");

    req.params = { id: "product_id" };

    mockProductBusiness.toggleProductActiveStatus.mockRejectedValue(error);

    await productController.toggleProductActiveStatus(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });
});

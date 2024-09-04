import { Request, Response } from "express";
import { ProductController } from "../../../src/controller/ProductController";
import { ProductBusiness } from "../../../src/business/ProductBusiness";
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

  test("should successfully create a product", async () => {
    const input = {
      name: "Product Name",
      description: "Product Description",
      price: 100,
      stock: 50,
      categoryId: 1,
      colorId: 2,
      sizeId: 3,
      genderId: 4,
      images: [
        {
          url: "http://example.com/image1.jpg",
          alt: "Image 1",
        },
        {
          url: "http://example.com/image2.jpg",
          alt: "Image 2",
        },
      ],
    };
  
    req.body = input;
    req.headers = {
      authorization: "Bearer some-token",
    };
  
    const output = {
      message: "Product created successfully",
      product: {
        id: "product_id",
        name: "Product Name",
        description: "Product Description",
        price: 100,
        stock: 50,
        createdAt: "2024-08-21T23:22:27.898Z",
        categoryId: 1,
        colorId: 2,
        sizeId: 3,
        genderId: 4,
        images: [
          {
            id: "image_id_1",
            product_id: "product_id",
            url: "http://example.com/image1.jpg",
            alt: "Image 1",
          },
          {
            id: "image_id_2",
            product_id: "product_id",
            url: "http://example.com/image2.jpg",
            alt: "Image 2",
          },
        ],
      },
    };
  
    mockProductBusiness.createProduct.mockResolvedValue(output);
  
    await productController.createProduct(req as Request, res as Response);
  
    expect(mockProductBusiness.createProduct).toHaveBeenCalledWith({
      token: "Bearer some-token",
      name: "Product Name",
      description: "Product Description",
      price: 100,
      stock: 50,
      categoryId: 1,
      colorId: 2,
      sizeId: 3,
      genderId: 4,
      images: [
        {
          url: "http://example.com/image1.jpg",
          alt: "Image 1",
        },
        {
          url: "http://example.com/image2.jpg",
          alt: "Image 2",
        },
      ],
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(output);
  });

  // --------------------------------------------------------------------

  test("should handle errors properly in createProduct", async () => {
    const error = new Error("Validation Error");
  
    req.headers = {
      authorization: "Bearer token",
    };
  
    req.body = {
      name: "Product Name",
      description: "Product Description",
      price: 100,
      stock: 50,
      categoryId: 1,
      colorId: 2,
      sizeId: 3,
      genderId: 4,
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

  test("should successfully edit a product", async () => {
    const input: UpdateProductInputDTO = {
      id: "product_id",
      name: "Updated Product Name",
      description: "Updated Product Description",
      price: 120,
      stock: 60,
      categoryId: 2,
      colorId: 3,
      sizeId: 4,
      genderId: 5,
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


  test("should handle errors properly in editProduct", async () => {
    const error = new Error("Error Updating Product");

    req.params = { id: "product_id" };
    req.body = {
      name: "Updated Product Name",
      description: "Updated Product Description",
      price: 120,
      stock: 60,
      categoryId: 2,
      colorId: 3,
      sizeId: 4,
      genderId: 5,
    };

    mockProductBusiness.editProduct.mockRejectedValue(error);

    await productController.editProduct(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });


  test("should successfully insert a product image", async () => {
    const input = {
      productId: "product_id",
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

    req.body = {
      productId: "product_id",
      url: "http://example.com/image3.jpg",
      alt: "Image 3",
    };

    mockProductBusiness.insertProductImage.mockRejectedValue(error);

    await productController.insertProductImage(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });


  test("should successfully delete a product image", async () => {
    const imageId = "image_id";
    const productId = "product_id";
  
    req.body = { id: imageId, productId: productId }; // Corrigindo para usar req.body
  
    const res = {
      status: jest.fn().mockReturnThis(),  // Permite encadeamento de métodos
      send: jest.fn(),
    } as unknown as Response;
  
    mockProductBusiness.deleteProductImage.mockResolvedValue({
      message: "Product image deleted successfully",
    });
  
    await productController.deleteProductImage(req as Request, res as Response);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Product image deleted successfully",
    });
  });


  test("should handle errors properly in deleteProductImage", async () => {
    const error = new Error("Error Deleting Product Image");
  
    req.body = { id: "image_id", productId: "product_id" };
  
    mockProductBusiness.deleteProductImage.mockRejectedValue(error);
  
    try {
      await productController.deleteProductImage(req as Request, res as Response);
    } catch (err) {
      console.error(err);
    }
  
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


  test("should handle errors properly in toggleProductActiveStatus", async () => {
    const error = new Error("Error Toggling Product Active Status");

    req.params = { id: "product_id" };

    mockProductBusiness.toggleProductActiveStatus.mockRejectedValue(error);

    await productController.toggleProductActiveStatus(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });
});

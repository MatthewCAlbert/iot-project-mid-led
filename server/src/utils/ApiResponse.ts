import express from "express";
interface ApiResponseI{
  statusCode?: number;
  message?: string;
  data?: any;
  success?: any;
}

class ApiResponse implements ApiResponseI{
  statusCode;
  message = "";
  success = true;
  data = {};

  constructor(res: express.Response, data: ApiResponseI){
    this.statusCode = data?.statusCode || 200;
    this.message = data?.message || "";
    this.data = data?.data || {};
    this.success = data["success"] !== undefined ? data?.success : true;

    res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data
    })
  }
}

export default ApiResponse;
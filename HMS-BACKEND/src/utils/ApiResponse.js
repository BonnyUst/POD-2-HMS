class ApiResponse{
    constructor(statuscode,message,data=null){
        this.sucess=statuscode<400;
        this.statucode=statuscode;
        this.message=message;
        this.data=data;
    }
}

module.exports =ApiResponse;
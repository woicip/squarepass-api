module.exports = class Response {

    res = null;

    constructor(res){
        this.res = res;
    }

    Success(props){
        this.res.send({ code: 200, result: props });
    }

    BadRequest(props){
        this.res.status(400).json({ code: 400, error: { status: "Bad Request", message: props.message  }});
    }

    Unauthorized(){
        this.res.status(401).send({ code: 401, error: { message: "UNAUTHORIZED" }});
    }

    NotFound(props){
        this.res.status(404).send({ code: 404, error: { status: "Not Found", message: props.message }});
    }

    InternalServerErrror(props){
        this.res.status(500).json({ code: 500, error: { status: "Internal Server Error", message: props.message }});
    }

}


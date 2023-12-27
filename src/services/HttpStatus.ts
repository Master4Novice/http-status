export class HttpStatus {
    private constructor(public readonly name: String, public readonly value: Number){}
    static readonly CONTINUE = new HttpStatus("Continue", 100);
    static readonly SWITCHING_PROTOCOLS = new HttpStatus("Switching Protocols", 101); 
    static readonly PROCESSING = new HttpStatus("Processing", 102);
    static readonly OK = new HttpStatus("OK", 200);
    static readonly CREATED = new HttpStatus("Created", 201);
    static readonly ACCEPTED = new HttpStatus("Accepted", 202);
    static readonly NON_AUTHORITATIVE_INFORMATION = new HttpStatus("Non-Authoritative Information", 203);
    static readonly NO_CONTENT = new HttpStatus("No Content", 204);
    static readonly RESET_CONTENT = new HttpStatus("Reset Content", 205);
    static readonly PARTIAL_CONTENT = new HttpStatus("Partial Content", 206);
    static readonly MULTI_STATUS = new HttpStatus("Multi-Status", 207);
    static readonly ALREADY_REPORTED = new HttpStatus("Already Reported", 208);
    static readonly IM_USED = new HttpStatus("IM Used", 226);
    static readonly MULTIPLE_CHOICES = new HttpStatus("Multiple Choices", 300);
    static readonly MOVED_PERMANENTLY = new HttpStatus("Moved Permanently", 301); 
    static readonly MOVED_TEMPORARILY = new HttpStatus("Moved Temporarily", 302);
    static readonly FOUND = new HttpStatus("Found", 302);
    static readonly SEE_OTHER = new HttpStatus("See Other", 303);  
    static readonly NOT_MODIFIED = new HttpStatus("Not Modified", 304);
    static readonly USE_PROXY = new HttpStatus("Use Proxy", 305);
    static readonly TEMPORARY_REDIRECT = new HttpStatus("Temporary Redirect", 307);
    static readonly BAD_REQUEST = new HttpStatus("Bad Request", 400);
    static readonly UNAUTHORIZED = new HttpStatus("Unauthorized", 401);
    static readonly PAYMENT_REQUIRED = new HttpStatus("Payment Required", 402);
    static readonly FORBIDDEN = new HttpStatus("Forbidden", 403);
    static readonly NOT_FOUND = new HttpStatus("Not Found", 404);
    static readonly METHOD_NOT_ALLOWED = new HttpStatus("Method Not Allowed", 405);
    static readonly NOT_ACCEPTABLE = new HttpStatus("Not Acceptable", 406);
    static readonly PROXY_AUTHENTICATION_REQUIRED = new HttpStatus("Proxy Authentication Required", 407);
    static readonly REQUEST_TIMEOUT = new HttpStatus("Request Timeout", 408);
    static readonly CONFLICT = new HttpStatus("Conflict", 409);
    static readonly GONE = new HttpStatus("Gone", 410);
    static readonly LENGTH_REQUIRED = new HttpStatus("Length Required", 411);
    static readonly PRECONDITION_FAILED = new HttpStatus("Precondition failed", 412);
    static readonly REQUEST_ENTITY_TOO_LARGE = new HttpStatus("Request Entity Too Large", 413);
    static readonly REQUEST_URI_TOO_LONG = new HttpStatus("Request-URI Too Long", 414);
    static readonly UNSUPPORTED_MEDIA_TYPE = new HttpStatus("Unsupported Media Type", 415);
    static readonly REQUESTED_RANGE_NOT_SATISFIABLE = new HttpStatus("Requested Range Not Satisfiable", 416);
    static readonly EXPECTATION_FAILED = new HttpStatus("Expectation Failed", 417);
    static readonly INSUFFICIENT_SPACE_ON_RESOURCE = new HttpStatus("Insufficient Space on Resource", 419);
    static readonly METHOD_FAILURE = new HttpStatus("Method Failure", 420); 
    static readonly DESTINATION_LOCKED = new HttpStatus("Destination Locked", 421);
    static readonly UNPROCESSABLE_ENTITY = new HttpStatus("Unprocessable Entity", 422);
    static readonly LOCKED = new HttpStatus("Locked", 423);
    static readonly FAILED_DEPENDENCY = new HttpStatus("Failed Dependency", 424);
    static readonly UPGRADE_REQUIRED = new HttpStatus("Upgrade Required", 426);
    static readonly INTERNAL_SERVER_ERROR = new HttpStatus("Internal Server Error", 500);
    static readonly NOT_IMPLEMENTED = new HttpStatus("Not Implemented", 501);
    static readonly BAD_GATEWAY = new HttpStatus("Bad Gateway", 502);
    static readonly SERVICE_UNAVAILABLE = new HttpStatus("Service Unavailable", 503);
    static readonly GATEWAY_TIMEOUT = new HttpStatus("Gateway Timeout", 504);
    static readonly HTTP_VERSION_NOT_SUPPORTED = new HttpStatus("HTTP Version Not Supported", 505);
    static readonly VARIANT_ALSO_NEGOTIATES = new HttpStatus("Variant Also Negotiates", 506);
    static readonly INSUFFICIENT_STORAGE = new HttpStatus("Insufficient Storage", 507);
    static readonly LOOP_DETECTED = new HttpStatus("Loop Detected", 508);
    static readonly NOT_EXTENDED = new HttpStatus("Not Extended", 510);    
    static values() {
        return Object.keys(this);
    }; 

    static valueOf(param: String | Number) {
        const keys = this.values();
        let httpStatus: HttpStatus
        return keys.filter((key)=> { 
            // @ts-ignore
            if(typeof this[key] !== 'function') {
                // @ts-ignore
                httpStatus = this[key];
                if(httpStatus.name === param || httpStatus.value === param) {
                    return key
                }
            }
        });
    };
}
# @master4n/http-status

![Owner Badge](https://img.shields.io/badge/Owner-Master4Novice-orange?style=flat)
![Package Version](https://img.shields.io/github/package-json/v/Master4Novice/common?filename=packages%2Fhttp-status%2Fpackage.json&color=green)
![Package License](https://img.shields.io/npm/l/%40master4n%2Fhttp-status)
![Package Downloads](https://img.shields.io/npm/dm/%40master4n%2Fhttp-status)

## Installation

```sh
npm install @master4n/http-status
```

## Summary

This package contains enum status and value for http.

## Details

Files were exported from the package from latest release.

````ts
import { HttpStatus } from @master4n/http-status

HttpStatus.OK.name // This will give string value.
HttpStatus.OK.value // This will give status code as number.
HttpStatus.valueOf(200) // This will give HttpStatus OK as string[]
HttpStatus.values() // This will give all status as string
// All possible new HttpStatus added
````

## Available Status Details

  |HTTP STATUS|CODE|TEXT|
  |-----------|----|----|
  |CONTINUE|100|Continue|
  |SWITCHING_PROTOCOLS|101|Switching Protocols|
  |PROCESSING|102|Processing|
  |OK|200|OK|
  |CREATED|201|Created|
  |ACCEPTED|202|Accepted|
  |NON_AUTHORITATIVE_INFORMATION|203|Non-Authoritative Information|
  |NO_CONTENT|204|No Content|
  |RESET_CONTENT|205|Reset Content|
  |PARTIAL_CONTENT|206|Partial Content|
  |MULTI_STATUS|207|Multi-Status|
  |ALREADY_REPORTED|208|Already Reported|
  |IM_USED|226|IM Used|
  |MULTIPLE_CHOICES|300|Multiple Choices|
  |MOVED_PERMANENTLY|301|Moved Permanently|
  |MOVED_TEMPORARILY|302|Moved Temporarily|
  |FOUND|302|Found|
  |SEE_OTHER|303|See Other|
  |NOT_MODIFIED|304|Not Modified|
  |USE_PROXY|305|Use Proxy|
  |TEMPORARY_REDIRECT|307|Temporary Redirect|
  |BAD_REQUEST|400|Bad Request|
  |UNAUTHORIZED|401|Unauthorized|
  |PAYMENT_REQUIRED|402|Payment Required|
  |FORBIDDEN|403|Forbidden|
  |NOT_FOUND|404|Not Found|
  |METHOD_NOT_ALLOWED|405|Method Not Allowed|
  |NOT_ACCEPTABLE|406|Not Acceptable|
  |PROXY_AUTHENTICATION_REQUIRED|407|Proxy Authentication Required|
  |REQUEST_TIMEOUT|408|Request Timeout|
  |CONFLICT|409|Conflict|
  |GONE|410|Gone|
  |LENGTH_REQUIRED|411|Length Required|
  |PRECONDITION_FAILED|412|Precondition failed|
  |REQUEST_ENTITY_TOO_LARGE|413|Request Entity Too Large|
  |REQUEST_URI_TOO_LONG|414|Request-URI Too Long|
  |UNSUPPORTED_MEDIA_TYPE|415|Unsupported Media Type|
  |REQUESTED_RANGE_NOT_SATISFIABLE|416|Requested Range Not Satisfiable|
  |EXPECTATION_FAILED|417|Expectation Failed|
  |INSUFFICIENT_SPACE_ON_RESOURCE|419|Insufficient Space on Resource|
  |METHOD_FAILURE|420|Method Failure|
  |DESTINATION_LOCKED|421|Destination Locked|
  |UNPROCESSABLE_ENTITY|422|Unprocessable Entity|
  |LOCKED|423|Locked|
  |FAILED_DEPENDENCY|424|Failed Dependency|
  |UPGRADE_REQUIRED|426|Upgrade Required|
  |INTERNAL_SERVER_ERROR|500|Internal Server Error|
  |NOT_IMPLEMENTED|501|Not Implemented|
  |BAD_GATEWAY|502|Bad Gateway|
  |SERVICE_UNAVAILABLE|503|Service Unavailable|
  |GATEWAY_TIMEOUT|504|Gateway Timeout|
  |HTTP_VERSION_NOT_SUPPORTED|505|HTTP Version Not Supported|
  |VARIANT_ALSO_NEGOTIATES|506|Variant Also Negotiates|
  |INSUFFICIENT_STORAGE|507|Insufficient Storage|
  |LOOP_DETECTED|508|Loop Detected|
  |NOT_EXTENDED|510|Not Extended|

## Credits

These definitions were written by [Master4Novice](https://github.com/Master4Novice).

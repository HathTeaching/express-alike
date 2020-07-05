import * as Parser from 'parsinator';

const methodParser = Parser.choice(["GET","HEAD","POST","PUT","DELETE","OPTIONS","CONNECT","PATCH"].map(Parser.str))
const lineEnd = Parser.choice([Parser.str("\n"), Parser.str("\r\n")]);
const requestLineParser = Parser.fromGenerator(function*() {
  let method = yield methodParser;
  let url = yield Parser.between(Parser.str(" "), Parser.str(" "));
  yield Parser.str("HTTP/")
  let httpVersion = yield Parser.regex(/1.0|1.1|2/);
  yield lineEnd
  return {
    method,
    url,
    httpVersion
  }
})

const headerParser = Parser.fromGenerator(function*() {
  let headerKey: string = yield Parser.until(Parser.str(":"));
  let headerValue: string = yield Parser.until(lineEnd);
  return {[headerKey]: headerValue};
})

const httpRequestParser = Parser.fromGenerator(function*(){
  let request = yield requestLineParser;
  let headers: any[] = yield Parser.many(headerParser);
  request.headers = Object.assign({},...headers);
  return request;
})
let sample = `GET / HTTP/1.1\n`;
let wholeSample = `GET /favicon.ico HTTP/1.1
Host: localhost:2000
Connection: keep-alive
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36
DNT: 1
Accept: image/webp,image/apng,image/*,*/*;q=0.8
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: no-cors
Sec-Fetch-Dest: image
Referer: http://localhost:2000/
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
`;
console.log(Parser.run(httpRequestParser, wholeSample));
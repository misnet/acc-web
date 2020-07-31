/**
 * 简单的静态服务器，单文件无依赖
 * 支持静态文件下载，简单缓存、分片下载（续传、多进程）
 * @author xBei <koaqiu@gmail.com>
 */

const http = require('http');
const FS = require('fs');
const OS = require('os');
const URL = require('url');
const PATH = require('path');
const { exec } = require('child_process');

const VERSION = [0, 2, 9];
const minetype = {
    "css": "text/css",
    "txt": "text/plain",
    "gitignore": "text/plain",
    "htm": "text/html",
    "html": "text/html",
    "xml": "text/xml",
    "js": "text/javascript",
    "ico": "image/x-icon",
    "gif": "image/gif",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "svg": "image/svg+xml",
    "tif": "image/tiff",
    "tiff": "image/tiff",
    "json": "application/json",
    "pdf": "application/pdf",
    "swf": "application/x-shockwave-flash",
    "woff": "application/x-font-woff",
    "woff2": "application/x-font-woff",
    "eof": "application/vnd.ms-fontobjec",
    "ttf": "application/font-sfn",
    "mp3": "audio/mpeg",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "aiv": "video/x-msvideo",
    "mov": "video/quicktime",
    "wmv": "video/x-ms-wmv",
    "unknown": "application/octet-stream",
    "zip": "application/zip"
};

const styles = {
    'bold': ['\x1B[1m', '\x1B[22m'],
    'italic': ['\x1B[3m', '\x1B[23m'],
    'underline': ['\x1B[4m', '\x1B[24m'],
    'inverse': ['\x1B[7m', '\x1B[27m'],
    'strikethrough': ['\x1B[9m', '\x1B[29m'],
    'white': ['\x1B[37m', '\x1B[39m'],
    'grey': ['\x1B[90m', '\x1B[39m'],
    'black': ['\x1B[30m', '\x1B[39m'],
    'blue': ['\x1B[34m', '\x1B[39m'],
    'cyan': ['\x1B[36m', '\x1B[39m'],
    'green': ['\x1B[32m', '\x1B[39m'],
    'magenta': ['\x1B[35m', '\x1B[39m'],
    'red': ['\x1B[31m', '\x1B[39m'],
    'yellow': ['\x1B[33m', '\x1B[39m'],
    'whiteBG': ['\x1B[47m', '\x1B[49m'],
    'greyBG': ['\x1B[49;5;8m', '\x1B[49m'],
    'blackBG': ['\x1B[40m', '\x1B[49m'],
    'blueBG': ['\x1B[44m', '\x1B[49m'],
    'cyanBG': ['\x1B[46m', '\x1B[49m'],
    'greenBG': ['\x1B[42m', '\x1B[49m'],
    'magentaBG': ['\x1B[45m', '\x1B[49m'],
    'redBG': ['\x1B[41m', '\x1B[49m'],
    'yellowBG': ['\x1B[43m', '\x1B[49m']
};

function mkdir(dir) {
    let baseDir = PATH.dirname(dir);
    if (!isFolder(baseDir)) {
        mkdir(baseDir);
    }
    FS.mkdirSync(dir);
    return dir;
}
function getFileInfo(file) {
    return new Promise((resolve, reject) => {
        FS.stat(file, (err, stats) => {
            if (err) {
                return reject(err);
            }
            return resolve(stats);
        });
    });
}
function getFiles(file) {
    return new Promise((resolve, reject) => {
        FS.readdir(file, (err, files) => {
            if (err) {
                return reject(err);
            }
            return resolve(files);
        });
    }).then(files => {
        return Promise.all(files.map(async (f) => {
            return {
                FileName: f,
                IsDirectory: isFolder(PATH.join(file, f)),
                ... await getFileInfo(PATH.join(file, f))
            }
        }));
    });
}
function isFolder(file) {
    if (!FS.existsSync(file))
        return false;
    return FS.statSync(file).isDirectory();
}
function isFile(file) {
    if (!FS.existsSync(file))
        return false;
    return FS.statSync(file).isFile();
}
function getTime(date, m = 0) {
    switch (m) {
        case 1:
            return `${fixNumber(date.getHours(), 2)}:${fixNumber(date.getMinutes(), 2)}`;
        case 2:
            return `${fixNumber(date.getHours(), 2)}:${fixNumber(date.getMinutes(), 2)}:${fixNumber(date.getSeconds(), 2)}.${fixNumber(date.getMilliseconds(), 3)}`;
        default:
            return `${fixNumber(date.getHours(), 2)}:${fixNumber(date.getMinutes(), 2)}:${fixNumber(date.getSeconds(), 2)}`;
    }
}
function fixNumber(n, length) {
    let str = n.toString();
    if (str.length >= length) return str;
    let s = '';
    for (let i = 0; i < length - str.length; i++) {
        s += '0';
    }
    return s + str;
}
let Log = {
    isDebug: false,
    log: (tag, msg, isErr) => {
        let time = setColor('grey', getTime(new Date()));
        if (isErr) {
            console.error(`[${tag}] [${time}] ${msg}`);
        } else {
            console.log(`[${tag}] [${time}] ${msg}`);
        }
    },
    info: (msg) => {
        Log.log(setColor('grey', '信息'), msg, false);
    },
    warn: (msg) => {
        Log.log(setColor('yellow', '警告'), msg, false);
    },
    test: (msg) => {
        if (Log.isDebug)
            Log.log(setColor('magenta', '测试'), msg, false);
    },
    error: (msg) => {
        Log.log(setColor('red', '错误'), msg, true);
    }
};
/**
 * 根据后缀获取对应到 minetype
 * 
 * @param {string} ext 
 * @returns {string}
 */
function getMimetype(ext) {
    let contentType = minetype[ext] || "application/octet-stream";
    return contentType;
}

function getExtname(pathName) {
    let ext = PATH.extname(pathName);
    return ext ? ext.slice(1) : 'unknown';
}

class WebBaseHanlder {
    /**
     * 检查地址是否存在，如果存在那么是文件还是目录
     * @param {URL} url
     * @returns {number} 0-不存在，1-文件，2-目录
     */
    checkUrl(url) {
        //对路径解码，防止中文乱码
        this.pathName = decodeURI(url.pathname);
        //获取资源文件的绝对路径
        this.filePath = PATH.join(this.wwwRoot, this.pathName);

        Log.test(`pathname = ${this.pathName}`);
        Log.test(`filePath = ${this.filePath}`);

        if (!FS.existsSync(this.filePath))
            return false;
        let st = FS.statSync(this.filePath);
        return st.isFile() ? 1 : 2;
    }
    handlerApi() {
        let arr = API_HANDLE.filter(h => h.regex.test(this.pathName)).sort((a,b)=> a.priority > b.priority ? 1:-1);
        API_HANDLE.map(item=> item.regex.test(''));//重置
        if (arr && arr.length > 0) {
            this.logHttpRequest(200);
            let h = arr.pop();
            return h.handler(this, h);
        }
        return false;
    }
    outputContent(content = '', code = 200) {
        this.response.writeHead(code, {
            "content-type": "text/html"
        });
        this.response.end(content);
        return this.response;
    }
    /**
     * 输出404错误
     * @returns {Response}
     */
    returnNotFound() {
        this.logHttpRequest(404);
        return this.outputContent('<html><head><title>404</title></head><body><h1>404 - File Not Found.</h1></body></html>', 404);
    }
    returnServerError(message = '<h1>500 Server Error</h1>') {
        this.logHttpRequest(500);
        return this.outputContent(message, 500);
    }
    /**
     *
     * @param {number} [code=200] 
     */
    logHttpRequest(code = 200) {
        Log.info(`${this.request.socket.remoteAddress} ${setColor('yellow', this.request.method)} ${this.request.url} ${code == 200 ? `${setColor('green', code)}` : `${setColor('red', code)}`}`);
    }
    /**
     * 
     * @param {Request} request 
     */
    getRequestQuery(request) {
        let requestUrl = request.url;
        let requestUri = URL.parse(requestUrl);
        return new URL.URLSearchParams(requestUri.search);
    }
    getJson(data) {
        this.logHttpRequest(200);
        this.response.writeHead(200, {
            "content-type": "application/json"
        });
        this.response.end(JSON.stringify(data));
        return this.response;
    }
    outputFile(outputFilePath = null) {
        if (outputFilePath == null) {
            outputFilePath = this.filePath;
        }
        const contentType = getMimetype(getExtname(outputFilePath));
        const status = FS.statSync(outputFilePath);
        if (this.request.headers["if-modified-since"] === status.ctime.toUTCString()) {
            this.response.writeHead(304);
            this.response.end();
            return this.response;
        }
        let statusCode = 200;
        let statusMessage = 'OK';
        let start = 0
        let end = status.size; //可读流是包前包后
        const resHeads = {
            "Content-type": contentType,
            "Content-Length": status.size,
            'Last-Modified': status.ctime.toUTCString()
        };
        const range = /^bytes=(\d+)-(\d*)/ig.exec(this.request.headers['range'] || '');
        if (range) {
            //分片
            // 拿到起始位置和结束为止
            start = /^\d+$/ig.test(range[1]) ? parseInt(range[1]) : start;
            end = /^\d+$/ig.test(range[2]) ? parseInt(range[2]) : end - 1;
            // 获取成功 并且文件总大小告诉客户端
            resHeads['Accept-Ranges'] = 'bytes';
            resHeads['Content-Range'] = `bytes ${start}-${end}/${status.size}`;
            //resHeads['Content-Length'] = end - start + 1;
            delete resHeads['Content-Length'];
            statusCode = 206;
            statusMessage = 'Partial Content';
        }
        const stream = FS.createReadStream(outputFilePath, { start, end });
        //错误处理
        stream.on('error', () => {
            this.returnServerError();
        });
        this.response.writeHead(statusCode, statusMessage, resHeads);
        this.logHttpRequest(statusCode);
        //读取文件
        stream.pipe(this.response);
        return this.response;
    }

    /**
     * 输出目录
     * @returns {Response}
     */
    async outputFolder() {
        //解决301重定向问题，如果pathname没以/结尾，并且没有扩展名
        const folder = this.pathName;
        if (!folder.endsWith('/')) {
            this.requestUri.pathname = folder + "/";
            const redirect = URL.format(this.requestUri); //"http://" + request.headers.host + pathName;
            this.logHttpRequest(301);
            this.response.writeHead(301, {
                location: redirect
            });
            this.response.end(`redirect to ${redirect}`);
            return this.response;
        };

        //处理默认文档
        if (!this.options.defaultDocuments.every((value) => {
            const defaultFile = PATH.join(this.filePath, value);
            if (isFile(defaultFile)) {
                this.outputFile(defaultFile);
                return false;
            }
            return true;
        })) {
            return this.response;
        }

        //没有找到默认文档
        if (!this.options.directoryBrowse) {
            return this.outputContent('<h1>403 Forbidden</h1>', 403);
        }
        //显示当前目录下所有文件
        this.response.writeHead(200, {
            "content-type": "text/html"
        });
        this.response.write(`<html><head><meta charset = 'utf-8'/><title>${folder}</title></head>`);
        this.response.write(`<body><h1>${folder}</h1><div><ul>`);
        if (folder != "/") {
            this.response.write(`<li>&lt;dir&gt; <a href='${PATH.join(folder, '..')}'>..</a></li>`);
        }

        const files = await getFiles(this.filePath)
            .then(files => {
                return files.sort((a, b) => {
                    if (a.IsDirectory && b.IsDirectory) {
                        return a.FileName < b.FileName ? -1 : 1;
                    }
                    if (!a.IsDirectory && !b.IsDirectory) {
                        return a.FileName < b.FileName ? -1 : 1;
                    }
                    return a.IsDirectory ? -1 : 1;
                });
            });
        if (files.length == 0) {
            this.response.write(`<li><b>EMPTY</b></li>`);
        }
        for (const file of files) {
            //await file.FileName;
            if (file.IsDirectory) {
                this.response.write(`<li>&lt;dir&gt; <a href='${file.FileName}'>${file.FileName}</a></li>`);
            } else {
                this.response.write(`<li><a href='${file.FileName}'>${file.FileName}</a></li>`);
            }
        }

        this.response.write('</ul></div>');
        this.response.write(`<footer>${new Date()}</footer>`);
        this.response.write('</body></html>');
        this.response.end();
        this.logHttpRequest(200);
    }
    /**
     * 处理请求
     * @returns 
     */
    process() {
        this.requestUri = URL.parse(this.request.url);
        //检查请求的是不是静态文件
        const fileStat = this.checkUrl(this.requestUri);
        //API
        var r = this.handlerApi();
        if(r !== false){
            return r;
        }

        if (!fileStat) {
            //TODO:处理/favicon.ico
            if(typeof options.rewrite === 'string' && options.rewrite.length > 0){
                return this.outputFile(PATH.join(this.wwwRoot, options.rewrite));
            }
            return this.returnNotFound();
        }

        switch (fileStat) {
            case 1:
                return this.outputFile();
            case 2:
                return this.outputFolder();
        }

        return this.returnServerError();
    }
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} options 
     */
    constructor(req, res, options) {
        this.request = req;
        this.response = res;
        this.options = options;
        this.wwwRoot = options.root;
    }
}
function createServer(options, API_HANDLE) {
    const port = options.port;
    const wwwroot = PATH.resolve(__dirname, options.root);
    if (!isFolder(wwwroot)) {
        Log.error(`${wwwroot} 无效`);
        process.exit(1);
        return 1;
    }
    options.root = wwwroot;
    if (!port || isNaN(port + '')) {
        showHelp();
        process.exit(1);
        return 1;
    } else {
        if (port < 1024 || port > 65535) {
            Log.error("port must be > 1024 AND < 65535");
            process.exit(1);
            return 1;
        }
    }
    global["API_HANDLE"] = API_HANDLE.filter(item => {
        if((item.regex instanceof RegExp) == false)
            return false;
        if(typeof item.handler != 'function')
            return false;
        return true;
    }).map(item => {
        if(isNaN(item.priority)){
            item.priority = 0;
        }
        return item;
    });
    const httpServer = http.createServer((req, res) => {
        new WebBaseHanlder(req, res, options).process();
    });
    httpServer.on('clientError', (err, socket) => {
        Log.error(err);
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });
    httpServer.on('error', (err, socket) => {
        Log.error(`CAN NOT listen at ${err.port}`);
    });
    //指定一个监听的接口
    httpServer.listen(port, function () {
        console.log(`RootDir: ${wwwroot}`);
        console.log(`app is running at port:${setColor('red', port)}`);
        if(options.openUrl === false) return;
        let os = process.platform;
        let url = `http://localhost:${port}/${options.openUrl.replace(/^\/+/ig, '')}`;
        switch (os) {
            case 'darwin':
                exec(`open '${url}'`);
                break;
            case 'freebsd':
            case 'linux':
            case 'sunos':
                exec(`x-www-browser '${url}'`);
                break;
            case 'win32':
                exec(`start ${url}`);
                break;
            default:

                break;
        }
    });
}
const defaultOptions = {
    port: 8080,
    help: false,
    version: false,
    update: false,
    openUrl: '',
    debug: false,
    root: __dirname,
    rewrite:'',
    directoryBrowse: true,
    defaultDocuments: [
        'index.html',
        'index.htm',
        'default.html',
        'default.htm',
    ]
};
function loadConfig(file = null) {
    let configFile = file;
    let config = {};
    if (file == null) {
        let me = __filename.split(PATH.sep).pop();
        configFile = PATH.join(__dirname, `${me}.json`);
    }
    Log.test(`加装配置文件：${configFile}`);
    if (isFile(configFile)) {
        try {
            config = JSON.parse(FS.readFileSync(configFile).toString());
            delete config['help'];
            delete config['update'];
            //delete config['debug'];
            delete config['version'];
            console.log(`加装配置文件：${configFile}`, setColor('green', '成功'))
        } catch (err) {
            Log.error(`配置文件（${configFile}）加载错误：${err}`)
            config = {};
        }
    }
    return config;
}
function handlerArgs() {
    let args = process.argv;
    let argsCount = args.length;
    if (argsCount < 3)
        return {};//Object.assign({}, defaultOptions, {});
    args = args.slice(2);
    let options = {};
    while (args.filter((v) => {
        return v.startsWith('-')
    }).length > 0) {
        let count = args.length;
        args.every((v, index) => {
            if (v.startsWith('-')) {
                if (index + 1 < count) {
                    let vv = args[index + 1];
                    if (!vv.startsWith('-')) {
                        options[v] = vv;
                        args.splice(index, 2);
                    } else {
                        options[v] = true;
                        args.splice(index, 1);
                    }
                } else {
                    options[v] = true;
                    args.splice(index, 1);
                }
                return false;
            }
            return true;
        });
    }
    delete options['defaultDocuments'];
    for (let key in options) {
        let element = options[key];
        switch (key) {
            case '-P':
            case '--port':
                if (isNaN(element)) {
                    Log.warn(`端口（${setColor('cyan', element)}）输入不正确，使用默认端口：${setColor('green', defaultOptions.port)}`);
                } else {
                    options['port'] = parseInt(element);
                }
                break;
            case '-H':
            case '--help':
                options['help'] = element;
                break;
            case '-U':
            case '--update':
                options['update'] = true;
                break;
            case '-R':
            case '--rewrite':
                options['rewrite'] = element;
                break;
            case '--directoryBrowse':
                if (['yes', 'no'].indexOf(element.toLowerCase()) == -1) {
                    Log.error(`directoryBrowse 的值必须是 ：yes|no`);
                    process.exit(2);
                    break;
                }
                options['directoryBrowse'] = /^yes$/g.test(element);
                break;
            default:
                options[key.replace(/^-{1,}/, '')] = element;
                break;
        }
        delete options[key];
    }
    return Object.assign({}, options, {
        args
    });
}

function showHelp() {
    let me = __filename.split(PATH.sep).pop();
    console.log(`把当前目录（${me}所在目录：${__dirname}）当作“主目录”创建一个简单的静态服务器`);
    console.log(`用法：node ${me} [选项]`);
    console.log();
    console.log('版本：', VERSION.join('.'));
    console.log(`如果配置文件（${me}.json）有效则先读取配置文件然后用下面的参数覆盖配置文件。`);
    console.log('选项：');
    console.log(' -P, --port <PORT>', "\t 监听的端口号（大于1024）。默认：8080");
    console.log(' --root <dir>', "\t\t 指定wwwRoot目录");
    console.log(' --directoryBrowse <yes|no>', "\t 是否浏览目录，默认：yes");
    console.log(' --openUrl <path>', "\t 默认打开的路径");
    console.log(' -R, --rewrite <path>', "\t 不存在的路径会自动重定向到这里");
    console.log(' -D, --debug', "\t\t 测试模式，会有更多的输出");
    console.log(' -U, --update', "\t\t 在线更新");
    console.log(' -V, --version', "\t\t 显示版本");
    console.log(' -H, --help', "\t\t 显示帮助");
}

/**
 * 设置控制台文本颜色
 * @param {string} color 
 * @param {*} text 
 */
function setColor(color, text) {
    let a = styles[color];
    if (!a) return text;
    return `${a[0]}${text}${a[1]}`;
}

/**
 * 下载远程文件
 * @param {string} urlToDownload 要下载的远程文件的地址 
 * @param {string} toSave   保存路径
 */
function downFile(urlToDownload, toSave) {
    return new Promise((resolve, reject) => {
        let uri = new URL.URL(urlToDownload);
        let httpClient = uri.protocol == 'https:' ? require('https') : require('http');
        Log.info(`下载：${urlToDownload}`);
        Log.test(`保存到文件：${toSave}`);
        const options = {
            method: 'GET',
            hostname: uri.host,
            path: uri.search ? `${uri.pathname}${uri.search}` : uri.pathname,
            headers: {
                'Content-Type': 'text/plain'
            }
        };
        let s = '';
        let f2 = FS.openSync(toSave, 'w');
        let r = httpClient.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('error', (err) => {
                FS.closeSync(f2);
                reject(err);
            });
            res.on('data', (chunk) => {
                s += chunk;
                FS.writeSync(f2, chunk);
            });
            res.on('end', () => {
                FS.closeSync(f2);
                Log.info(`下载完成，共下载：${Buffer.from(s).length} bytes`);;
                Log.test(`文件内容：\n${s}`);
                resolve(s);
            });
        });
        r.on('error', (e) => {
            reject(e);
        });
        r.end();
    });
}

function doUpdate() {
    console.log('在线更新');
    // 一、校验本地文件读写权限
    // 自己
    let selfFile = __filename;
    try {
        FS.accessSync(selfFile, FS.constants.F_OK | FS.constants.W_OK);
    } catch (err) {
        Log.error(`没有权限更新 ${selfFile}`);
        return;
    }

    // 临时文件
    let tmpDir = FS.mkdtempSync(PATH.join(OS.tmpdir(), 'mini-web-ser-'));
    let tmpFile = PATH.join(tmpDir, PATH.basename(selfFile));
    try {
        let f2 = FS.openSync(tmpFile, 'w');
        FS.closeSync(f2);
    } catch (err) {
        Log.error(`无法创建 ${tmpFile}`);
        return;
    }
    console.log('当前版本：', VERSION.join('.'));
    // 二、下载文件
    downFile('https://gitee.com/xbei/codes/cy07qm6idzvst52lp38eh46/raw?blob_name=web.js', tmpFile)
        .then((content) => {
            //判断是否可更新
            let match = /const VERSION = \[(\d+), (\d+), (\d+)\];/ig.exec(content);
            if (match) {
                if (VERSION[0] < match[1] || VERSION[1] < match[2] || VERSION[2] < match[3]) {
                    console.log(`最新版本： ${match[1]}.${match[2]}.${match[3]}`);
                    return true;
                } else {
                    Log.test(`最新版本： ${match[1]}.${match[2]}.${match[3]}`);
                }
            } else {
                Log.test(`代码解析失败[0x00123AE0]`);
            }
            return false;
        })
        .then(canUpdate => {
            if (canUpdate) {
                const oldContent = FS.readFileSync(selfFile).toString();
                let beginIndex = oldContent.indexOf('/*[自定义代码:'+'开始]*/');
                let myCode = '';
                if(beginIndex > 0){
                    let endIndex = oldContent.indexOf('/*[自定义代码:'+'结束]*/', beginIndex);
                    if(endIndex > 0){
                        myCode = oldContent.substring(beginIndex+14, endIndex);
                    }
                }
                FS.copyFile(tmpFile, selfFile, (err) => {
                    if (err) {
                        Log.error(`复制文件失败：${err}`);
                        throw err;
                    };
                    // 重写 自定义代码
                    if(myCode.length > 0){
                        let newCode = FS.readFileSync(selfFile).toString();
                        let beginIndex = newCode.indexOf('/*[自定义代码:'+'开始]*/');
                        if(beginIndex > 0){
                            let endIndex = newCode.indexOf('/*[自定义代码:'+'结束]*/', beginIndex);
                            if(endIndex > 0){
                                FS.writeFile(
                                    selfFile,
                                    newCode.substring(0, beginIndex+14) + myCode + newCode.substr(endIndex),
                                    (err)=>{}
                                );
                            }
                        }
                    }
                    console.log(setColor('green', '更新成功'));
                    FS.unlink(tmpFile, err => { });
                });
            } else {
                console.log('已经是最新版了，不需要更新');
            }
        })
        .catch(e => {
            Log.error(`更新失败：${e.message}`);
        });
}


let options = handlerArgs();
Log.isDebug = options.debug;
options = Object.assign({}, defaultOptions, loadConfig(options.config), options);

//console.log(options);
if (options.help === true) {
    showHelp();
    Log.test(JSON.stringify(options));
    process.exit(0);
} else if (options.version == true) {
    console.log('版本：', VERSION.join('.'));
} else if (options.update === true) {
    doUpdate();
} else {
    let port = options.port;
    if (!port || isNaN(port + '')) {
        showHelp();
        process.exit(1);
    } else {
        if (port < 1024 || port > 65535) {
            Log.error("port must be > 1024 AND < 65535");
            process.exit(1);
        }
    }

    createServer(options,
        /*[自定义代码:开始]*/
        [{
            priority: 0,//优先级，如果成功匹配多个则只执行数字最大的
            key: 'action test',//key，暂时没什么用处
            regex: /\.action/ig,//必须！正则表达式。匹配地址（类似路由功能）
            //处理程序，必须！参数“ser”是上面的 “WebBaseHanlder”
            handler: (ser) => {
                ser.outputContent('<html><head><meta charset ="utf-8"/><title>Action 示例</title></head><body>Action 示例</body></html>');
            }
        }]
        /*[自定义代码:结束]*/
    );
}

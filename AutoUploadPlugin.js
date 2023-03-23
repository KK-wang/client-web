const { NodeSSH } = require('node-ssh');
// 一个库，用 node 通过 ssh 来连接远程服务器。

class AutoUploadPlugin {
  constructor(options) {
    this.ssh = new NodeSSH(); // ssh 实例。
    this.options = options; // 用户传入的选项，其中包括 remotePath、host、username、password。
  }

  apply(compiler) {
    // compiler 是 webpack 生命周期中只会调用一次的对象，上面挂载着许多的 hook。
    compiler.hooks.afterEmit.tapAsync("AutoUploadPlugin", async (compilation, callback) => {
      // 1.获取输出的文件夹。
      const outputPath = compilation.outputOptions.path;

      // 2.连接服务器（ssh连接）。
      await this.connectServer();

      // 3.删除原来目录中的内容。
      // 虽然重名文件会被覆盖，但是为了防止有未被覆盖的文件，最好还是直接删除原目录中的内容。
      const serverDir = this.options.remotePath;
      await this.ssh.execCommand(`rm -rf ${serverDir}/*`);

      // 4.上传文件到服务器。
      await this.uploadFiles(outputPath, serverDir);

      // 5.关闭 ssh 连接。
      this.ssh.dispose();

      // 异步操作完成，回调表示结束。
      callback();
    });
  }

  async connectServer() {
    // 连接服务器。
    try {
      await this.ssh.connect({
        host: this.options.host, // 服务器域名。
        username: this.options.username, // 用户名。
        password: this.options.password // 密码。
      });
      console.log('server connected');
    } catch (e) {
      console.log(e);
    }
  }

  async uploadFiles(localPath, remotePath) {
    // localPath 代表本地要上传的文件夹，remotePath 代表要上传到远程服务器的那个文件夹。
    try {
      const status = await this.ssh.putDirectory(localPath, remotePath, {
        recursive: true, // 是否递归上传。
        concurrency: 10 // 是否并行上传。
      });
      // status 记录上传结果。
      console.log('isSuccess? ', status);
    } catch (e) {
      console.log(e);
    }
  }

}

module.exports = AutoUploadPlugin;
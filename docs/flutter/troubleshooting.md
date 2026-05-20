---
description: 踩坑记录
layoutClass: m-nav-layout
outline: [2, 3, 4]
---

# 常见问题与解决方法

## 🐞 踩坑记录

 安装视频播放包构建下载包太慢，可以添加国内镜像源

```sh
  # 视频播放
  media_kit: ^1.1.10
  media_kit_video: ^1.2.4
  media_kit_libs_video: ^1.0.4
```

添加国内镜像源

```sh
# android\gradle\wrapper\gradle-wrapper.properties
# media-kit 国内镜像加速（关键）
media_kit.download.mirror=https://ghproxy.net/


# 报错 MD5 mismatch. File deleted: D:\learn-project\flutter\legado_flutter\build\media_kit_libs_android_video\v1.1.7\default-arm64-v8a.jar
# 把这4个jar包放到下面这个目录里,手动放进去
build\media_kit_libs_android_video\v1.1.7\default-arm64-v8a.jar
```

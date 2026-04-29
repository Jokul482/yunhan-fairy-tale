/**
 * @description: 更新
 * @param {}
 * @return {*}
 */
export function updateManager() {
  const updateManager = wx.getUpdateManager();
  const account = wx.getAccountInfoSync();
  console.log("当前版本" + (account.miniProgram.version || "获取失败"));
  // 监听向微信后台请求检查更新结果事件。微信在小程序每次启动（包括热启动）时自动检查更新，不需由开发者主动触发
  updateManager.onCheckForUpdate(({ hasUpdate /* 是否有新版本 */ }) => {
    // 请求完新版本信息的回调
    console.log("是否有新版本", hasUpdate);
  });
  // 监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
  updateManager.onUpdateReady(function () {
    wx.showModal({
      title: "更新提示",
      content: "新版本已经准备好，是否重启应用？",
      success({ confirm }) {
        if (confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        }
      },
    });
  });
  // 监听小程序更新失败事件。小程序有新版本，客户端主动触发下载（无需开发者触发），下载失败（可能是网络原因等）后回调
  updateManager.onUpdateFailed(() => {
    wx.showToast({
      title: "新版本下载失败",
      icon: "error",
      duration: 2000,
    });
  });
}
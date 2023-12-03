// router.ts
type RoutePath = string
type QueryParams = Record<string, unknown>

class Router {
  /**
   * 构建带查询参数的URL
   * @param path 页面路径
   * @param params 查询参数
   */
  private buildUrl(path: RoutePath, params?: QueryParams): string {
    if (!params) return path
    const query = Object.keys(params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(
            params[key] as string
          )}`
      )
      .join('&')
    return `${path}?${query}`
  }

  /**
   * 跳转到指定页面
   * @param path 页面路径
   * @param params 页面查询参数
   */
  navigateTo(path: RoutePath, params?: QueryParams) {
    try {
      const url = this.buildUrl(path, params)
      uni.navigateTo({ url })
      console.log(`Navigating to: ${url}`)
    } catch (error) {
      console.error('Failed to navigate:', error)
    }
  }

  /**
   * 重定向到指定页面
   * @param path 页面路径
   * @param params 页面查询参数
   */
  redirectTo(path: RoutePath, params?: QueryParams) {
    try {
      const url = this.buildUrl(path, params)
      uni.redirectTo({ url })
      console.log(`Redirecting to: ${url}`)
    } catch (error) {
      console.error('Failed to redirect:', error)
    }
  }

  /**
   * 返回上一页面或多级页面
   * @param delta 返回的页面数
   */
  navigateBack(delta: number = 1) {
    try {
      uni.navigateBack({ delta })
      console.log(`Navigating back by: ${delta} pages`)
    } catch (error) {
      console.error('Failed to navigate back:', error)
    }
  }

  /**
   * 切换到 tabBar 页面
   * @param path tabBar 页面的路径
   */
  switchTab(path: RoutePath) {
    try {
      uni.switchTab({ url: path })
      console.log(`Switching to tab: ${path}`)
    } catch (error) {
      console.error('Failed to switch tab:', error)
    }
  }

  /**
   * 关闭所有页面，打开到应用内的某个页面
   * @param path 页面路径
   * @param params 页面查询参数
   */
  reLaunch(path: RoutePath, params?: QueryParams) {
    try {
      const url = this.buildUrl(path, params)
      uni.reLaunch({ url })
      console.log(`Relaunching to: ${url}`)
    } catch (error) {
      console.error('Failed to relaunch:', error)
    }
  }
}

export const router = new Router()

import { BASE_URL, TIME_OUT } from './config'
import { useMemberStore } from '@/store/member'
import { Data } from '@/types/global'

import i18n from '@/locale'
import { HttpStatusCode } from '@/common/constants/HttpStatusCode'

const t = i18n.global.t

class ApiService {
  constructor(
    private baseURL: string = BASE_URL,
    private timeout: number = TIME_OUT
  ) {
    this.setupInterceptors()
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors() {
    const httpInterceptor = {
      invoke: (options: UniApp.RequestOptions) => {
        if (!options.url.startsWith('http')) {
          options.url = this.baseURL + options.url
        }
        options.timeout = this.timeout
        options.header = {
          'source-client': 'miniapp',
          ...options.header
        }
        const memberStore = useMemberStore()
        const token = memberStore.profile?.token
        if (token) {
          options.header.Authorization = token
        }
      }
    }

    uni.addInterceptor('request', httpInterceptor)
    uni.addInterceptor('uploadFile', httpInterceptor)
  }

  /**
   * 基础请求
   * @param options 请求设置
   * @returns Promise<Data<T>>
   */
  private request<T>(options: UniApp.RequestOptions): Promise<Data<T>> {
    // 1. 返回 Promise 对象
    return new Promise<Data<T>>((resolve, reject) => {
      uni.request({
        ...options,
        // 响应成功
        success(res) {
          // 状态码 2xx，参考 axios 的设计
          if (
            res.statusCode >= HttpStatusCode.OK &&
            res.statusCode < HttpStatusCode.MultipleChoices
          ) {
            // 2.1 提取核心数据 res.data
            resolve(res.data as Data<T>)
          } else if (res.statusCode === HttpStatusCode.Unauthorized) {
            // 401错误  -> 清理用户信息，跳转到登录页
            const memberStore = useMemberStore()
            memberStore.clearProfile()
            uni.redirectTo({ url: '/pages/login/login' })
            uni.showToast({
              icon: 'none',
              title: (res.data as Data<T>).msg || t('request.Unauthorized')
            })
            reject(res)
          } else if (res.statusCode === HttpStatusCode.NotFound) {
            // 其他错误 -> 根据后端错误信息轻提示
            uni.showToast({
              icon: 'none',
              title: (res.data as Data<T>).msg || t('request.NotFound')
            })
            reject(res)
          }
        },
        // 响应失败
        fail(err) {
          if (err.errMsg?.includes('timeout')) {
            // 超时错误
            uni.showToast({
              icon: 'none',
              title: t('request.TimeOut')
            })
            reject(err)
          }
          reject(err)
        }
      })
    })
  }

  public get<T>(
    url: string,
    params?: any,
    options?: UniApp.RequestOptions
  ): Promise<Data<T>> {
    return this.request<T>({ ...options, url, method: 'GET', data: params })
  }

  public post<T>(
    url: string,
    data?: any,
    options?: UniApp.RequestOptions
  ): Promise<Data<T>> {
    return this.request<T>({ ...options, url, method: 'POST', data })
  }

  public put<T>(
    url: string,
    data?: any,
    options?: UniApp.RequestOptions
  ): Promise<Data<T>> {
    return this.request<T>({ ...options, url, method: 'PUT', data })
  }

  public delete<T>(
    url: string,
    params?: any,
    options?: UniApp.RequestOptions
  ): Promise<Data<T>> {
    return this.request<T>({ ...options, url, method: 'DELETE', data: params })
  }
}

export default ApiService

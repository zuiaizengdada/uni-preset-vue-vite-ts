// 重置数据
export const resetData = (dialogModel: Record<string, any>) => {
  const keys = Object.keys(dialogModel)
  const obj: Record<string, any> = {}

  keys.forEach((item) => {
    const value = dialogModel[item]
    switch (typeof value) {
      case 'string':
        obj[item] = ''
        break
      case 'number':
        obj[item] = 0
        break
      case 'boolean':
        obj[item] = false
        break
      case 'object':
        if (Array.isArray(value)) {
          obj[item] = []
        } else if (value instanceof Date) {
          obj[item] = new Date()
        } else if (value === null) {
          obj[item] = null
        } else {
          obj[item] = {}
        }
        break
      case 'undefined':
        obj[item] = undefined
        break
      case 'symbol':
        obj[item] = Symbol()
        break
      case 'function':
        obj[item] = function () {}
        break
      case 'bigint':
        obj[item] = BigInt(0)
        break
      // 其他未知类型可以根据需要调整
      default:
        obj[item] = null
        break
    }
  })

  return Object.assign(dialogModel, obj)
}

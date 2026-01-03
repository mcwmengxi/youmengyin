/**
 * @desc 计算距离某个时间到现在有多少天
 */
export function getDiffDate(targetDate: number | string | Date) {
  let date1 = new Date(targetDate)
  let date2 = new Date()
  date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
  date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
  const diff = date2.getTime() - date1.getTime()
  const diffDate = diff / (24 * 60 * 60 * 1000)
  return diffDate
}
/**
 * 节流函数 throttle
 *
 * 该函数用于生成一个节流函数，用于控制某个函数在给定时间间隔内只能被执行一次
 * 主要用于性能优化，例如限制事件处理函数的触发频率
 *
 * @param fn 要被节流的函数
 * @param delay 节流的时间间隔，单位 ms，默认为 300ms
 * @returns 返回一个新的节流的函数
 */
export function throttle(fn: Function, delay: number = 300): any {
  let valid = true // 用于标记函数是否可以执行
  return function (...args: any[]) {
    // 返回一个新的函数，该函数负责执行节流逻辑
    if (valid) {
      fn(...args) // 执行原函数
      valid = false // 将函数置为无效
      setTimeout(() => {
        valid = true
      }, delay)
    }
    return false // 返回false，表示当前不执行函数
  }
}
/**
 * 防抖函数 debounce
 *
 * 主要用于限制函数调用的频率，当频繁触发某个函数时，实际上只需要在最后一次触发后的一段时间内执行一次即可
 * 这对于诸如输入事件处理函数、窗口大小调整事件处理函数等可能会频繁触发的函数非常有用
 *
 * @param fn 要执行的函数
 * @param delay 防抖的时间期限，单位 ms，默认为 300ms
 * @returns 返回一个新的防抖的函数
 */
export function debounce(fn: Function, delay: number = 300): any {
  let timer: any = null // 使用闭包保存定时器的引用
  return function (...args: any[]) {
    // 返回一个包装函数
    if (timer) {
      // 如果定时器存在，则清除之前的定时器
      clearTimeout(timer)
    }
    // 设置新的定时器，延迟执行原函数
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
/**
 * 获取 URL 路径中的指定参数
 *
 * @param paramName 参数名
 * @returns 参数值
 */
export function getQueryParam(paramName: string) {
  const reg = new RegExp('(^|&)' + paramName + '=([^&]*)(&|$)')
  let value = decodeURIComponent(window.location.search.substr(1)).match(reg)
  if (value != null) {
    return unescape(value[2])
  }
  return null
}
// 通用随机获取方法
export const getRandomInt = (max: number) =>
  Math.floor(Math.random() * Math.floor(max))

const pattern =
  /[a-zA-Z0-9_\u0392-\u03C9\u00C0-\u00FF\u0600-\u06FF\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\uAC00-\uD7AF]+/g

export function countWord(data: string) {
  const m = data.match(pattern)
  let count = 0
  if (!m) {
    return 0
  }
  for (let i = 0; i < m.length; i += 1) {
    if (m[i].charCodeAt(0) >= 0x4e00) {
      count += m[i].length
    } else {
      count += 1
    }
  }
  return count
}

export default {
    // 店族 ajax 请求，增加了与店族后台拟定的默认参数
    fetch (obj) {
        obj.url = obj.url

        obj.showIndicator = obj.showIndicator == undefined ? true : obj.showIndicator
        obj.onloadstart = () => {
            obj.loadstart && obj.loadstart()

            // if loading
            if (obj.showIndicator) vm.$dialog.loading.open('none')
        }

        obj.onloadend = (xhr) => {
            // err = -1，进行微信授权
            let res = xhr.response
            if (res && res.err == -1 && !!res.data)
                location.href = res.data
            obj.loadend && obj.loadend()

            if (obj.showIndicator) vm.$dialog.loading.close()
        }

        obj.data = vm.$.extend({
            token: vm.$.getCookie(vm.config.tokenName)
        }, obj.data || {})

        obj.headers = obj.headers || {
            'Content-Type': 'application/json',
            "Cache-Control": "no-cache"          // 禁止缓存（返回刷新数据）
        }

        return new Promise(function (resolve, reject) {
            vm.$.fetch(obj)
            .then(res => {
                if (!res.err) resolve(res)
                else if (res.err > 0)  reject(res)
                // err = -1，进行微信授权
                else if (res.err == -1 && !!res.data)
                    location.href = res.data
            })
            .catch(err => vm.$dialog.toast({mes: '请求失败'}))
        })
    },

    // 店族 get 请求
    get (obj) {
        return this.fetch(obj)
    },

    // 店族 post 请求
    post (obj) {
        obj.type = 'POST'
        return this.fetch(obj)
    }
}
/**
 * 修改于 2019-08-10
 * 作者: Best921
 * 功能: resolvers 实现
 */

import Db from '../db'

const { PubSub, withFilter } = require('apollo-server')
const pubsub = new PubSub()// apollo-server 里负责订阅和发布的类，它在接受订阅时提供一个异步迭代器，在后端觉得需要发布订阅的时候向前端发布 payload

const USER_UPDATE_CHANNEL = 'USER_UPDATE'

export default {
    Mutation: {
        updateUser: (parent, { id, name, email, age, gender }) => Db.user({ id })
            .then(existUser => {
                if (!existUser)
                    throw new Error('没有这个id的人')
                return existUser
            })
            .then(() => Db.updateUser({ id, name, email, age, gender }))
            .then(user => {
                pubsub.publish(USER_UPDATE_CHANNEL, { subsUser: user })
                return user
            })
        
    },
    Subscription: {
        subsUser: {
            subscribe: withFilter(// 过滤掉不需要的订阅消息
                (parent, { id }) => pubsub.asyncIterator(USER_UPDATE_CHANNEL),
                (payload, variables) => payload.subsUser.id === variables.id
            ),
            resolve: (payload, variables) => {
                console.log('🚢 接收到数据： ', payload)
                return payload.subsUser
            }
        }
    }
}

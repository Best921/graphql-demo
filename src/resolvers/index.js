/**
 * 创建于 2019-03-10
 * 作者: SHERlocked93
 * 功能: resolvers 实现
 */


import Db from '../db'

const { PubSub, withFilter } = require('apollo-server')
const pubsub = new PubSub()

const USER_UPDATE_CHANNEL = 'USER_UPDATE'

export default {
    Query: {
        hello: () => 'Hello world!',
        users: (parent, args) => Db.users({}),
        user: (parent, { id }) => Db.user({ id })
    },
    Mutation: {
        createUser: (parent, { id, name, email, age, gender }) => Db.user({ id })
            .then(existUser => {
                if (existUser)
                    throw new Error('已经有这个id的人了')
            })
            .then(() => Db.createUser({ id, name, email, age, gender }))
        ,
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
        ,
        deleteUser: (parent, { id }) => Db.user({ id })
            .then(existUsers => {
                if (!existUsers.length)
                    throw new Error('没有这个id的人')
                return existUsers[0]
            })
            .then(user => new Promise(resolve => Db.deleteUser(user)
                .then(_ => resolve(user))))
    },
    Subscription: {
        subsUser: {
            subscribe: withFilter(
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

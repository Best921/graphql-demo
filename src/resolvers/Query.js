/**
 * 修改于 2019-08-10
 * 作者: Best921
 * 功能: resolvers 实现
 */

import Db from '../db'

export default {
    Query: {
        users: (parent, args) => Db.users({}),
        user: (parent, { id }) => Db.user({ id }),
        article: (parent,  { id })=>`article content of ${id} is xxx`,
        comment: ( parent,  { id })=>`comment content of ${id} is xxx`,
    }
}

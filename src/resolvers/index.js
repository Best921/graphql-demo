/**
 * 修改于 2019-08-10
 * 作者: Best921
 * 功能: resolvers 实现
 */

import merge from 'lodash/merge'

import Query from './Query.js'
import Mutation from './Mutation.js'
import Subscription from './Subscription.js'

const PureObj = Object.create(null)

export default merge(PureObj, Query, Mutation, Subscription)

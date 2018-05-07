/**
 * Created by Administrator on 2017/7/23.
 */
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommend() {
  /**
   * 获取轮播图数据
   */
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDiscList() {
  /**
   * 获取歌单数据
   */
  const url = '/api/getDiscList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList(disstid) {
  /**
   * 获取歌单数据
   */
  const url = '/api/getDiscSongList'
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    disstid: disstid,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: '1237381745',
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
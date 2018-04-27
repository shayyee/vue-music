/**
 * Created by lenovo on 2017/12/27.
 */
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getSingerList() {
  const url = 'https://szc.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesice: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 5381
  });

  return jsonp(url, data, options)
}

export function getVKey(songmid) {
  const url = '/api/getVKey';
  const data = Object.assign({}, commonParams, {
    g_tk:5381,
    loginUin:0,
    hostUin:0,
    format:'json',
    platform: 'yqq',
    needNewCode: 0,
    cid:205361747,
    uin:0,
    songmid: songmid,
    filename:`C400${songmid}.m4a`,
    guid: '2155542447'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSingerDetail(singerId) {
  const url = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg";

  const data = Object.assign({}, commonParams, {
    hostUin:0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    inCharset:'utf8',
    outCharset:'utf-8',
    singermid: singerId,
    g_tk: 5381
  });
  return jsonp(url,data,options);
}
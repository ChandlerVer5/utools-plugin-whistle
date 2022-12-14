// Copyright (c) 2022 ChandlerVer5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/**
 * https://u.tools/docs/developer/api.html#%E6%95%B0%E6%8D%AE%E5%BA%93-db
 */

// import { throwIfMiss } from './index';

// #region throwIfMiss
export const throwIfMiss = (paramName: string) => {
  throw new Error(`参数错误${paramName ? ': ' : ''}${paramName}`);
};
// #endregion

const FIELD_ID = `主键ID`;
export const AUTO_REFRESH_ID = `_autoRefresh`;

/**
 * 根据主键获取数据
 * 执行该方法将会根据文档ID获取数据
 * @param {String} id 主键
 */
export function dbGet(id: string, autoPut = false, defaultDb: any = null) {
  const db = window.utools.db.get(id);

  if (db && db.error) throw new Error(db.message);

  if (!db && autoPut) {
    return dbPut({ _id: AUTO_REFRESH_ID, data: defaultDb });
  }

  return db;
}

/**
 * 保存数据
 * 执行该方法将会创建或更新数据库文档
 * _id代表这个文档在数据库中唯一值，如果值不存在，则会创建一个新的文档，如果值已经存在，则会进行更新。你可能已经注意到，返回对象中包含一个rev属性，这是代表此文档的版本，每次对文档进行更新时，都要带上最新的版本号，否则更新将失败，版本化的意义在于解决同步时数据冲突。
 * 另外需要注意，每次更新时都要传入完整的文档数据，无法对单个字段进行更新。
 * @param { _id, data, _rev } data 待存储数据
 * @return { _id, _rev ,data}  存储成功后返回最新的数据
 */
export function dbPut(data: DbDoc) {
  const dbPut = window.utools.db.put(data);
  if (dbPut && dbPut.error) throw new Error(dbPut.message);

  const db = window.utools.db.get(data._id);
  if (!db) throw new Error('数据保存失败');
  if (db && db.error) throw new Error(db.message);

  return db;
}

/**
 * 根据主键删除数据
 * 执行该方法将会删除数据库文档，可以传入文档对象或文档id进行操作。
 * @param {String} id 主键
 */
export function dbRemove(id: string): DbReturn {
  if (!id) throwIfMiss(id);

  const db = window.utools.db.remove(id);
  if (db && db.error) throw new Error(db.message);

  return db;
}

/**
 * 批量更新数据
 * 执行该方法将会批量更新数据库文档，传入需要更改的文档对象合并成数组进行批量更新。
 * @param {Array} data [{ _id, data, _rev }]
 */
export function dbUpdate(data: DbDoc[]): DbReturn {
  const db = window.utools.db.bulkDocs(data) as any;
  if (db && db.error) throw new Error(db.message);

  return db;
}

/**
 * 获取所有数据
 * 执行该方法将会获取所有数据库文档，如果传入字符串，则会返回以字符串开头的文档，也可以传入指定ID的数组，不传入则为获取所有文档。
 */
export function dbAll() {
  return window.utools.db.allDocs();
}

/**
 * uBrowser 打开页面
 * @param {String} url UBrowser打开的链接地址
 */
export function open(url: string) {
  const browsers = window.utools.getIdleUBrowsers() || [];

  const opendBrowser = browsers.find(
    browser => browser.url.indexOf(url) !== -1
  );

  if (opendBrowser) {
    return window.utools.ubrowser.show().run(opendBrowser.id);
  }

  return (
    window.utools.ubrowser
      // .devTools('bottom')
      .goto(url)
      .css(
        `#container { min-width: 100% !important; min-height: 100% !important; }
       .w-req-data-content.fill.orient-vertical-box{ min-width: 1100px; }`
      )
      .run({ width: 1200, height: 800 })
  );
}

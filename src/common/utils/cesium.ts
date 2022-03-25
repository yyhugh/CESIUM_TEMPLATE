import * as Cesium from "cesium";
import h337 from "heatmap.js";

export default {
  createViewer,
  globeReadyPromise,
  cameraFlytoShenzhen,
  getAMapTileLayerRoadNet,
  getGeoJSON,
  drawAreaPolyline,
  drawHeatmap,
  drawSpreadRing,
  on,
  onClick,
  collectTimer,
  recoverTimer,
  grid,
};

/**
 * @viewer
 * 默认只剩下个球，界面控件全部隐藏
 */
function createViewer(elementId: string, options?: Cesium.Viewer.ConstructorOptions) {
  const defaultOptions = {
    geocoder: false, // 地理位置搜索控件
    homeButton: false, // 平滑过渡到默认视角控件
    sceneModePicker: false, // 切换2D、3D地图模式控件
    baseLayerPicker: false, // 切换三维数字地球底图控件
    navigationHelpButton: false, // 帮助提示控件
    animation: false, // 视窗动画播放速度控件
    timeline: false, // 时间轴控件
    fullscreenButton: false, // 视窗全屏按钮控件
    infoBox: false, // 信息窗口控件
  };
  options = {
    ...defaultOptions,
    ...(options || {}),
  };
  const viewer = new Cesium.Viewer(elementId, options);
  (viewer as any)._cesiumWidget._creditContainer.style.display = "none"; // 隐藏logo
  return viewer;
}

/**
 * @hook
 * 球体首次完成瓦片加载时触发并自动回收该事件
 * @param timeout 超时时间(秒)
 */
function globeReadyPromise(viewer: Cesium.Viewer, timeout = 6): Promise<void> {
  return new Promise((resolve, reject) => {
    let cancel = false;
    const eventHelper = new Cesium.EventHelper();
    const timer = setTimeout(() => {
      cancel = true;
      eventHelper.removeAll();
      reject(`\n[globeReadyPromise]: 等待时间大于${timeout}秒，瓦片加载已超时！`);
    }, timeout * 1000);
    eventHelper.add(viewer.scene.globe.tileLoadProgressEvent, (event) => {
      // 注意：有概率出现瓦片加载不出来的情况
      if (event === 0 && !cancel) {
        clearTimeout(timer);
        eventHelper.removeAll();
        resolve();
      }
    });
  });
}

/**
 * @camera
 * 相机飞行到深圳
 * @param duration 过渡时间(秒)。默认3秒
 * @param delay 延迟执行时间(秒)。默认不延迟
 * @param complete 完成时的回调方法
 * @returns cancel 延迟执行时的取消方法
 */
function cameraFlytoShenzhen(viewer: Cesium.Viewer, duration = 3, delay = 0, complete?: () => void) {
  let timer: unknown;
  if (delay > 0) {
    timer = setTimeout(handler, delay * 1000);
  } else {
    handler();
  }
  function handler() {
    viewer.scene.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(114.23, 22.06, 58000.0), // (114.214357, 22.657728, 110000.0) 中心点
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-40.0), // (-90.0) 正上方俯视
        roll: 0.0,
      },
      duration,
      complete: () => {
        complete && complete();
      },
    });
  }
  return () => {
    if (timer) {
      clearTimeout(timer as number);
    }
  };
}

/**
 * @layer
 * 获取高德地图路网图层
 */
function getAMapTileLayerRoadNet(): Promise<Cesium.UrlTemplateImageryProvider> {
  return new Promise((resolve, reject) => {
    const layer = new Cesium.UrlTemplateImageryProvider({
      url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
      minimumLevel: 4,
      maximumLevel: 18,
    });
    layer.readyPromise.then(() => {
      resolve(layer);
    });
  });
}

/**
 * @handler
 * 根据区域名称读取本地geoJSON文件。geoJSON文件存放目录`/public/static/geoJSON/*.json`
 */
function getGeoJSON(areaName: string): Promise<Cesium.GeoJsonDataSource> {
  return new Promise((resolve, reject) => {
    const promise = Cesium.GeoJsonDataSource.load(`/static/geoJSON/${areaName}.json`);
    promise.then((geoJsonDataSource) => {
      resolve(geoJsonDataSource);
    });
    (promise as any).otherwise(() => {
      reject(`\n[getGeoJSON]:【${areaName}】可前往 https://datav.aliyun.com/tools/atlas 获取geoJSON数据文件。`);
    });
  });
}

/**
 * @polyline
 * 根据geoJSON获取区域边界线
 * @param areaName 行政区域名称
 * @param width 线条宽度
 * @param color 线条颜色 `Cesium.Color`
 */
async function drawAreaPolyline(viewer: Cesium.Viewer, areaName: string, width = 6, color = Cesium.Color.BLUE) {
  const dataSource = await getGeoJSON(areaName);
  // 放入场景中
  viewer.dataSources.add(dataSource);
  // 统一修改样式
  const entities = dataSource.entities.values;
  entities.forEach((entity: any) => {
    entity.polygon.material = new Cesium.Color(0, 0, 0, 0);
    entity.polygon.outline = false;
    // 行政区域边界线加粗
    const positions = entity.polygon.hierarchy._value.positions;
    entity.polyline = {
      positions,
      width,
      material: color,
      clampToGround: true,
    };
  });
}

interface IHeatmapConfig<T> {
  /**
   * 容器元素
   */
  container: HTMLElement;
  /**
   * 圈定绘制范围 [左上角, 右下角]
   * @example
   * 深圳 [113.681448, 22.867816, 114.733389, 22.386134]
   */
  range: Array<number>;
  /**
   * 数据组
   * @example
   * "lng,lat": [{}, {}, {}]
   */
  group: Map<string, Array<T>>;
  /**
   * 半径
   */
  radius: number;
}

/**
 * @rectangle
 * 绘制热力图
 */
async function drawHeatmap<T>(viewer: Cesium.Viewer, config: IHeatmapConfig<T>) {
  const { container, range: degrees, group, radius } = config;
  const lngMin = degrees[0];
  const lngMax = degrees[2];
  const latMin = degrees[3];
  const latMax = degrees[1];
  // 计算圆点与两个坐标点之间的距离，也就是获取宽高
  const o = Cesium.Cartographic.fromDegrees(lngMin, latMax);
  const x = Cesium.Cartographic.fromDegrees(lngMax, latMax);
  const y = Cesium.Cartographic.fromDegrees(lngMin, latMin);
  // 获取ox之间的距离
  const eg1 = new Cesium.EllipsoidGeodesic();
  eg1.setEndPoints(o, x);
  const o2x = eg1.surfaceDistance;
  // 获取oy之间的距离
  const eg2 = new Cesium.EllipsoidGeodesic();
  eg2.setEndPoints(o, y);
  const o2y = eg2.surfaceDistance;
  // 根据绘制范围计算出热力图画布的宽高
  const scale = o2y / o2x; // 高/宽
  const width = window.innerWidth;
  const height = (width * scale) >> 0;
  const points: Array<{ x: number; y: number; value: number; radius: number }> = [];
  let max = 0;
  // 经纬度转平面坐标系
  for (const v of group) {
    const [lnglatText, list] = v;
    const lnglat = lnglatText.split(",");
    const count = list.length;
    max = Math.max(max, count);
    const lng = +lnglat[0];
    const lat = +lnglat[1];
    const leftScale = (lng - lngMin) / (lngMax - lngMin);
    const topScale = (lat - latMin) / (latMax - latMin);
    // 比例换算
    points.push({
      x: (width * leftScale) >> 0,
      y: (height * (1 - topScale)) >> 0,
      value: count,
      radius,
    });
  }
  // 绘制热力图
  const heatmap = h337.create({
    container,
  });
  // 设置画布大小
  const cvs = (heatmap as any)._renderer.canvas as HTMLCanvasElement;
  cvs.width = width;
  cvs.height = height;
  const data: any = {
    max,
    data: points,
  };
  heatmap.setData(data);
  // 在场景中的绘制范围
  const rectangle = Cesium.Rectangle.fromDegrees(degrees[0], degrees[3], degrees[2], degrees[1]);
  // 热力图层加入场景中(方式1)
  viewer.entities.add({
    rectangle: {
      coordinates: rectangle,
      material: new Cesium.ImageMaterialProperty({
        image: (heatmap as any)._renderer.canvas,
      }),
    },
  });
  // 热力图层加入场景中(方式2)
  // const provider = new Cesium.SingleTileImageryProvider({
  //   url: (heatmap as any)._renderer.canvas.toDataURL(),
  //   rectangle,
  // });
  // viewer.imageryLayers.addImageryProvider(provider);
  // 显示绘制范围（调试时可用）
  // viewer.entities.add({
  //   rectangle: {
  //     coordinates: rectangle,
  //     material: Cesium.Color.RED.withAlpha(0.2),
  //   },
  // });
}

interface ISpreadRingConfig {
  count: number;
  /**
   * 中心点 [lng, lat]
   */
  center: Array<number>;
  /**
   * 短半轴配置
   */
  minorAxisOptions: IAxisOptions;
  /**
   * 长半轴配置
   */
  majorAxisOptions: IAxisOptions;
  callback?: () => void;
}

interface IAxisOptions {
  max: number;
  min: number;
  step: number;
  r: number;
}

/**
 * @ellipse
 * 绘制扩散环
 */
function drawSpreadRing(viewer: Cesium.Viewer, config: ISpreadRingConfig, callback?: () => void) {
  const { center: lnglat, minorAxisOptions, majorAxisOptions } = config;
  const material = new Cesium.ImageMaterialProperty({
    color: Cesium.Color.RED.withAlpha(0.6),
    image: "/static/img/spread-ring.svg",
    transparent: true,
  });
  const entity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(lnglat[0], lnglat[1]),
    ellipse: {
      // 半短轴
      semiMinorAxis: new Cesium.CallbackProperty(() => {
        return sizeChange(minorAxisOptions, () => {
          config.count--;
          if (config.count <= 0) {
            viewer.entities.remove(entity);
            callback && callback();
          }
        });
      }, false),
      // 半长轴
      semiMajorAxis: new Cesium.CallbackProperty(() => sizeChange(majorAxisOptions), false),
      height: 1,
      material,
    },
  });
  function sizeChange(options: IAxisOptions, callback?: () => void) {
    options.r += options.step;
    if (options.r >= options.max) {
      options.r = options.min;
      callback && callback();
    }
    return options.r;
  }
}

/**
 * 定时器收集器
 */
function collectTimer() {
  return new Set();
}

/**
 * 回收定时器
 */
function recoverTimer<T>(collectTimer: Set<T>) {
  const timers = collectTimer.values();
  for (const timer of timers) {
    if (typeof timer === "function") {
      timer();
    } else if (typeof timer === "number") {
      clearTimeout(timer);
    }
  }
  collectTimer.clear(); // 清空定时器列表
}

interface IScreenSpaceEvent {
  position: Cesium.Cartesian2;
  startPosition: Cesium.Cartesian2;
  endPosition: Cesium.Cartesian2;
}

/**
 * 监听事件
 */
function on(type: string, viewer: Cesium.Viewer, callback: (event: IScreenSpaceEvent) => void) {
  let eventType: Cesium.ScreenSpaceEventType = -1;
  const events = ["click", "mousemove"];
  if (type === events[0]) {
    eventType = Cesium.ScreenSpaceEventType.LEFT_CLICK;
  } else if (type === events[1]) {
    eventType = Cesium.ScreenSpaceEventType.MOUSE_MOVE;
  } else {
    console.error(`[CesiumUtil on]: 不存在该事件类型，请检查或补充。\n当前事件类型'${type}'，已支持的事件类型：${events.join("、")}。`);
    return;
  }
  const eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  eventHandler.setInputAction((event: IScreenSpaceEvent) => {
    callback(event);
  }, eventType);
}

/**
 * 监听点击事件
 */
function onClick(viewer: Cesium.Viewer, callback: (event: IScreenSpaceEvent, pick: any) => void) {
  const eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  eventHandler.setInputAction((event: IScreenSpaceEvent) => {
    const pick = viewer.scene.pick(event.position);
    // 检查是否存在空间数据
    if (Cesium.defined(pick)) {
      callback(event, pick);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

interface IGridOptions {
  /**
   * 起点
   */
  lnglat: Array<number>;
  /**
   * 总数
   */
  total: number;
  /**
   * 列数
   */
  cols: number;
  /**
   * 间隔距离(单位像素)
   * [→,↓]
   */
  gap: Array<number>;
}

/**
 * 平面网格分布
 */
function grid(viewer: Cesium.Viewer, options: IGridOptions) {
  const { lnglat, total, cols, gap } = options;
  const c3 = Cesium.Cartesian3.fromDegrees(lnglat[0], lnglat[1]);
  const c2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, c3);
  const rows = Math.ceil(total / cols); // 计算行数
  const list: Array<Cesium.Cartesian3> = [];
  let row = 0;
  while (row < rows) {
    const y = c2.y + gap[1] * row;
    let x = 0;
    for (let i = 0; i < cols; i++) {
      x = c2.x + gap[0] * i;
      list.push(viewer.scene.camera.pickEllipsoid(new Cesium.Cartesian2(x, y)) as Cesium.Cartesian3);
    }
    row++;
  }
  return list;
}

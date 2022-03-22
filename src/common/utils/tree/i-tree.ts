/**
 * 一个标准树节点
 */
export interface ITreeNode {
  /**
   * 子集合
   */
  children?: Array<ITreeNode>;

  /**
   * 可扩展字段
   */
  [propName: string]: any;
}

/**
 * 被注入的节点信息
 */
export interface ITreeNodeInfo {
  /**
   * 索引值
   */
  index: number;

  /**
   * 当前层级
   */
  level: number;

  /**
   * 自定义链路 默认使用索引
   */
  relation: Array<any>;

  /**
   * 索引链路
   */
  indexRelation: Array<number>;

  /**
   * 子集合键名
   */
  childrenKey: "children" | string;

  /**
   * 链路关系组成元素键名 默认为index
   */
  relationKey: "index" | string;

  /**
   * 是否为当前层级最末节点
   */
  isLevelEnd: boolean;

  /**
   * 是否为最末节点链路
   */
  isLevelEndRelation: Array<boolean>;

  /**
   * 有多少个兄弟姐妹节点
   */
  peers?: number;

  /**
   * 下一级有多少个子节点
   */
  childrenLen?: number;

  [propName: string]: any;
}

/**
 * 已被注入信息的树节点
 */
export interface ITreeInjectionInfoNode extends ITreeNode {
  /**
   * 节点信息
   */
  nodeInfo: ITreeNodeInfo;
}

/**
 * 遍历方法回调函数接收的参数
 * @param node 当前遍历的节点
 * @param stop 停止遍历的方法
 */
export type ITreeCallback<N = ITreeInjectionInfoNode> = (node: N, stop: () => void) => void;

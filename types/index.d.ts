import { ReactNode, ReactChildren, FC, PropsWithChildren, CSSProperties } from "react";
import { VariableSizeListProps } from "react-window";

/**
 * All of the data should contain an id property that will be used
 * in the height lookup process.
 */
interface BasicDataType {
  id: string | number;
}

/**
 * The cache object inner structure.
 */
export type cacheValuesType = {
  [key: string]: number
}

/**
 * The cache object.
 */
export class CacheType {
  values: cacheValuesType[];
  constructor(initialValues: cacheValuesType);
  clearCache(): void;
} 

export interface DynamicListProps<K extends BasicDataType> extends Omit<VariableSizeListProps, "itemSize" | "itemCount" | "estimatedItemSize"> {
  data: K[];
  cache: CacheType;
  lazyMeasurement?: boolean;
  recalculateItemsOnResize?: {
    width: boolean;
    height: boolean;
  };
  measurementContainerElement?: (style: CSSProperties, children: ReactChildren) => ReactNode;
  debug?: boolean;
}

/**
 * A virtualized list which handles item of varying sizes.
 * Read the props section in the README for additional information on the added props above the basic react-window ones. 
 * Read the implementation section in the README for additional information on the general algorithm.
 */
export default function DynamicList<K extends BasicDataType>(props: PropsWithChildren<DynamicListProps<K>>): ElementType;

/**
 * A utility function for creating cache objects.
 * @param knownSizes A mapping between id and the height of the element.
 */
export const createCache = (knownSizes?: cacheValuesType[]) => new CacheType;
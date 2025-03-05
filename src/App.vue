<template>
  <div class="main-viewer">
    <a-layout>
      <a-layout-sider :width="350">
        <div class="sider-content">
          <a-collapse :default-active-key="['GlobalOptions']">
            <GlobalOptions
              :fixed-frames="fixedFrames"
              v-model="rvizOptions.globalOptions"
            />
            <template
              v-for="(item, index) in rvizOptions.items"
              :key="item.name"
            >
              <template v-if="item.type === 'Grid'">
                <GridOptions
                  v-model="item.options"
                  v-model:show="item.show"
                  :fixed-frame="rvizOptions.globalOptions.fixedFrame"
                  :fixed-frames="fixedFrames"
                  :name="item.name"
                  :index="index"
                />
              </template>
              <template v-if="item.type === 'URDF'">
                <URDFOptions
                  v-model="item.options"
                  v-model:show="item.show"
                  :topics="topics"
                  :name="item.name"
                  :index="index"
                />
              </template>
              <template v-if="item.type === 'MarkerArray'">
                <MarkerArrayOptions
                  v-model="item.options"
                  v-model:show="item.show"
                  :topics="topics"
                  :name="item.name"
                  :index="index"
                />
              </template>
              <template v-if="item.type === 'LaserScan'">
                <LaserScanOptions
                  v-model="item.options"
                  v-model:show="item.show"
                  :topics="topics"
                  :name="item.name"
                  :index="index"
                />
              </template>
              <template v-if="item.type === 'PointCloud2'">
                <PointCloud2Options
                  v-model="item.options"
                  v-model:show="item.show"
                  :topics="topics"
                  :name="item.name"
                  :index="index"
                />
              </template>
              <template v-if="item.type === 'OccupancyGrid'">
                <OccupancyGridOptions
                  v-model="item.options"
                  v-model:show="item.show"
                  :topics="topics"
                  :name="item.name"
                  :index="index"
                />
              </template>
              <template v-if="item.type === 'Path'">
                <PathOptions
                  v-model="item.options"
                  v-model:show="item.show"
                  :topics="topics"
                  :name="item.name"
                  :index="index"
                />
              </template>
              <template v-if="item.type === 'PointStamped'">
                <PointOptions
                  v-model="item.options"
                  v-model:show="item.show"
                  :topics="topics"
                  :name="item.name"
                  :index="index"
                />
              </template>
              <template v-if="item.type === 'PolygonStamped'">
                <PolygonOptions
                  v-model="item.options"
                  v-model:show="item.show"
                  :topics="topics"
                  :name="item.name"
                  :index="index"
                />
              </template>
              <template v-if="item.type === 'PoseStamped'">
                <PoseOptions
                  v-model="item.options"
                  v-model:show="item.show"
                  :topics="topics"
                  :name="item.name"
                  :index="index"
                />
              </template>
              <template v-if="item.type === 'PoseArray'">
                <PoseArrayOptions
                  v-model="item.options"
                  v-model:show="item.show"
                  :topics="topics"
                  :name="item.name"
                  :index="index"
                />
              </template>
              <template v-if="item.type === 'PoseWithCovarianceStamped'">
                <PoseWithCovarianceOptions
                  v-model="item.options"
                  v-model:show="item.show"
                  :topics="topics"
                  :name="item.name"
                  :index="index"
                />
              </template>
            </template>
          </a-collapse>
        </div>
      </a-layout-sider>
      <a-layout-content>
        <Viewer
          :url="wsServer"
          :reconnect-time="3000"
          :click-topic="clickTopic"
          :camera-type="cameraType"
          :fixed-frame="rvizOptions.globalOptions.fixedFrame"
          :background="rvizOptions.globalOptions.background"
          @fixed-frames="setFixedFrames"
          @support-view-topics="setSupportViewTopics"
          ref="viewerRef"
        >
          <template v-for="(item, index) in rvizOptions.items" :key="item.name">
            <template v-if="item.show">
              <template v-if="item.type === 'Grid'">
                <Grid :key="index" :options="item.options" />
              </template>
              <template v-if="item.type === 'URDF'">
                <URDF :key="index" :options="item.options" />
              </template>
              <template v-if="item.type === 'LaserScan'">
                <LaserScan :key="index" :options="item.options" />
              </template>
              <template v-if="item.type === 'PointCloud2'">
                <PointCloud2 :key="index" :options="item.options" />
              </template>
              <template v-if="item.type === 'MarkerArray'">
                <MarkerArray :key="index" :options="item.options" />
              </template>
              <template v-if="item.type === 'OccupancyGrid'">
                <OccupancyGrid :key="index" :options="item.options" />
              </template>
              <template v-if="item.type === 'Path'">
                <Path :key="index" :options="item.options" />
              </template>
              <template v-if="item.type === 'PointStamped'">
                <Point :key="index" :options="item.options" />
              </template>
              <template v-if="item.type === 'PolygonStamped'">
                <Polygon :key="index" :options="item.options" />
              </template>
              <template v-if="item.type === 'PoseStamped'">
                <Pose :key="index" :options="item.options" />
              </template>
              <template v-if="item.type === 'PoseArray'">
                <PoseArray :key="index" :options="item.options" />
              </template>
              <template v-if="item.type === 'PoseWithCovarianceStamped'">
                <PoseWithCovariance :key="index" :options="item.options" />
              </template>
            </template>
          </template>
        </Viewer>
        <div class="controls">
          <a-button @click="switchCameraType" size="mini">
            {{ cameraType }}
          </a-button>
          <a-dropdown-button
            style="margin-top: 10px"
            size="mini"
            @click="startClickPose"
          >
            <ArrowUpRight />
            <template #content>
              <a-doption
                v-for="item in clickTopics"
                :key="item.topic"
                @click="() => setClickTopic(item)"
                class="click-topic"
                :class="{ active: clickTopic?.topic === item.topic }"
              >
                <div>
                  {{ item.topic }}
                </div>
              </a-doption>
            </template>
          </a-dropdown-button>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { ArrowUpRight } from 'lucide-vue-next';
import {
  Grid,
  LaserScan,
  MarkerArray,
  OccupancyGrid,
  Path,
  Point,
  PointCloud2,
  Polygon,
  Pose,
  PoseArray,
  PoseWithCovariance,
  URDF,
  Viewer,
} from '@byslin/web_rviz';
import GlobalOptions from './components/GlobalOptions.vue';
import LaserScanOptions from './components/LaserScanOptions.vue';
import OccupancyGridOptions from './components/OccupancyGridOptions.vue';
import { Channel } from '@foxglove/ws-protocol';
import GridOptions from './components/GridOptions.vue';
import MarkerArrayOptions from './components/MarkerArrayOptions.vue';
import PointCloud2Options from './components/PointCloud2Options.vue';
import PathOptions from './components/PathOptions.vue';
import PointOptions from './components/PointOptions.vue';
import PolygonOptions from './components/PolygonOptions.vue';
import PoseOptions from './components/PoseOptions.vue';
import PoseArrayOptions from './components/PoseArrayOptions.vue';
import PoseWithCovarianceOptions from './components/PoseWithCovarianceOptions.vue';
import URDFOptions from './components/URDFOptions.vue';

const viewerRef = ref<
  { startClick: (type: 'pose' | 'point') => void } | undefined
>(undefined);
const wsServer = ref(`ws://${location.hostname}:8765`);
const cameraType = ref<'2D' | '3D'>('3D');
const fixedFrames = ref<string[]>([]);
const topics = ref<Record<string, Channel>>({});
const clickTopics = ref<Channel[]>([]);
const clickTopic = ref<Channel | undefined>(undefined);
const rvizOptions = ref<{
  globalOptions: {
    fixedFrame: string;
    background: string;
  };
  items: {
    type: string;
    name: string;
    show: boolean;
    options: any;
  }[];
}>({
  globalOptions: {
    fixedFrame: 'map',
    background: '#303030',
  },
  items: [
    {
      type: 'Grid',
      name: 'Grid',
      show: true,
      options: {
        color: '#248EFF',
        cellSize: 1,
        numCells: 10,
      },
    },
    {
      type: 'URDF',
      name: 'URDF',
      show: true,
      options: {},
    },
  ],
});

const switchCameraType = () => {
  cameraType.value = cameraType.value === '2D' ? '3D' : '2D';
};

const setClickTopic = (topic: Channel) => {
  clickTopic.value = topic;
};

const startClickPose = () => {
  if (clickTopic.value === undefined) {
    alert('请先选择一个主题');
  } else {
    if (viewerRef.value) {
      const split = clickTopic.value.schemaName.split('/');
      const type = split[split.length - 1];
      if (type === 'PointStamped') {
        viewerRef.value.startClick('point');
      } else {
        viewerRef.value.startClick('pose');
      }
    }
  }
};

const setFixedFrames = (data: string[]) => {
  fixedFrames.value = data;
};

const setSupportViewTopics = (data: Record<string, Channel>) => {
  topics.value = data;
  clickTopics.value = [];
  for (const item of Object.values(data)) {
    const split = item.schemaName.split('/');
    const type = split[split.length - 1];
    const defaultOptions = getDefaultOptions(type);
    if (type === 'PointStamped') {
      clickTopics.value.push(item);
    } else if (type === 'PoseStamped') {
      clickTopics.value.push(item);
    } else if (type === 'PoseWithCovarianceStamped') {
      clickTopics.value.push(item);
    }
    rvizOptions.value.items.push({
      name: item.topic,
      options: {
        topic: item.topic,
        ...defaultOptions,
      },
      show: false,
      type,
    });
  }
};

const getDefaultOptions = (type: string) => {
  if (type === 'MarkerArray') {
    return {};
  } else if (type === 'LaserScan') {
    return {
      color: '#FF0000',
      size: 0.01,
    };
  } else if (type === 'PointCloud2') {
    return {
      size: 0.01,
      decayTime: 0,
      colorType: 'FlatColor',
      color: '#FF0000',
    };
  } else if (type === 'OccupancyGrid') {
    return {
      type: 'map',
      opacity: 0.7,
    };
  } else if (type === 'Path') {
    return {
      color: '#CC00FF',
      offsetZ: 0.1,
    };
  } else if (type === 'PointStamped') {
    return {
      color: '#CC00FF',
      offsetZ: 0,
      radius: 0.2,
    };
  } else if (type === 'PolygonStamped') {
    return {
      color: '#CC00FF',
    };
  } else if (type === 'PoseStamped') {
    return {
      color: '#CC00FF',
    };
  } else if (type === 'PoseArray') {
    return {
      color: '#CC00FF',
      length: 1.0,
    };
  } else if (type === 'PoseWithCovarianceStamped') {
    return {
      color: '#CC00FF',
    };
  }
};
</script>

<style scoped>
.main-viewer {
  width: 100%;
  height: 100%;
}

.main-viewer :deep(.arco-layout) {
  width: 100%;
  height: 100%;
}

.sider-content {
  height: 100%;
  overflow-y: auto;
  user-select: none;
}

.sider-content :deep(.arco-collapse-item-header-title) {
  word-wrap: break-word;
  flex-wrap: wrap;
  width: 260px;
}

.controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
}

.click-topic.active {
  background: aqua;
}
</style>

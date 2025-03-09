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
              <component
                :is="OptionComponents[item.type]"
                v-model="item.options"
                v-model:show="item.show"
                :fixed-frame="rvizOptions.globalOptions.fixedFrame"
                :fixed-frames="fixedFrames"
                :topics="topics"
                :name="item.name"
                :index="index"
              />
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
              <component
                :is="ViewerComponents[item.type]"
                :key="index"
                :options="item.options"
              />
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
import GlobalOptions from './components/options/GlobalOptions.vue';
import { Channel } from '@foxglove/ws-protocol';
import { OptionComponents } from './components/options';
import { ViewerComponents } from '@byslin/web_rviz';

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

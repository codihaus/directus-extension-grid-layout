<template>
    <div
        class="card"
        :class="{ loading, readonly, selected: item && modelValue.includes(item[itemKey]), 'select-mode': selectMode }"
        @click="handleClick"
    >
        <v-icon class="selector" :name="selectionIcon" @click.stop="toggleSelection"/>
        <component
            :is="layoutComponent"
            :id="item.id"
            :image="imageSource && imageSource?.id || null"
            :selectMode="selectionIcon"
            :title=" getItemValue(item,title)"
            :subtitle=" getItemValue(item,subtitle)"
            :tag=" getItemValue(item,tag)"
            :statusClass="statusClass(item.status)"
            :dateCreated="formatDate(item.date_created)"
            :classImgFit="imgFit()"
        />
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';
import ItemOne from './ItemOne.vue';
import ItemTwo from './ItemTwo.vue';
import ItemThree from './ItemThree.vue';

type File = {
    [key: string]: any;
    id: string;
    type: string;
    modified_on: Date;
};
export default defineComponent({
    components: {ItemOne, ItemTwo, ItemThree},
    props: {
        icon: {
            type: String,
            default: 'box',
        },
        file: {
            type: Object as PropType<File>,
            default: null,
        },
        crop: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        item: {
            type: Object as PropType<Record<string, any>>,
            default: null,
        },
        modelValue: {
            type: Array as PropType<(string | number)[]>,
            default: () => [],
        },
        selectMode: {
            type: Boolean,
            default: false,
        },
        to: {
            type: String,
            default: '',
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        itemKey: {
            type: String,
            required: true,
        },
        imageSource: {
            type: String,
        },
        title: {
            type: String,
            default: 'title'
        },
        subtitle: {
            type: String,
            default: 'subtitle'
        },
        imageFit: {
            type: String,
        },
        tag: {
            type: String,
            default: false
        },
        size: {
            type: Number,
            default: 1
        },
    },
    emits: ['update:modelValue'],
    setup(props, {emit}) {

        const router = useRouter();
        const imgError = ref(false)


        const {t} = useI18n({
            locale: 'en',
            messages: {
                en: {
                    seconds: ' seconds ago',
                    minutes: ' minutes ago',
                    hours: ' hours ago',
                    days: ' days ago',
                    weeks: ' weeks ago',
                    months: ' months ago',
                    years: ' years ago',

                },
                vi: {
                    seconds: ' giây trước',
                    minutes: ' phút trước',
                    hours: ' giờ trước',
                    days: ' ngày trước',
                    weeks: ' tuần trước',
                    months: ' tháng trước',
                    years: ' năm trước'
                }
            }
        })

        const selectionIcon = computed(() => {
            if (!props.item) return 'radio_button_unchecked';

            return props.modelValue.includes(props.item[props.itemKey]) ? 'check_circle' : 'radio_button_unchecked';
        });

        function toggleSelection() {
            if (!props.item) return null;

            if (props.modelValue.includes(props.item[props.itemKey])) {
                emit(
                    'update:modelValue',
                    props.modelValue.filter((key) => key !== props.item[props.itemKey])
                );
            } else {
                emit('update:modelValue', [...props.modelValue, props.item[props.itemKey]]);
            }
        }

        function handleClick() {
            if (props.selectMode === true) {
                toggleSelection();
            } else {
                router.push(props.to);
            }
        }

        function convertToArr(str: string): string[] {
            if (!str) return []
            return str?.replace(/[{{}}]/g, '').split(' ')
        }

        function getItemValue(item: object, name: string) {

            if (!name) return;

            let arr = convertToArr(name);

            let arrvalue = arr?.map((i) => {
                let tagfirst = i.split('.')[0]
                let value = item[tagfirst]
                if (typeof value == 'string' || typeof value == 'number') return value
                if (value && value.length > 0) return value?.map(x => get_2(x, arr[0], null))
            })
            return arrvalue?.join(' ')

        }

        function get_2(obj: object, path: string, defaultValue: any): any {
            const keys = Array.isArray(path) ? path : path?.split('.')
            let result = obj

            for (let i = 1; i < keys.length; i++) {
                const key = keys[i]
                result = result[key]

                if (result === undefined) {
                    return defaultValue
                }
            }

            return result
        }


        function formatDate(data: string): string {
            const end_date = new Date(data);
            const start_date = new Date();
            const diff = Math.abs(start_date.getTime() - end_date.getTime());
            const diffDays = Math.ceil(diff / (1000));
            return diffDays < 60
                ? `${diffDays} ` + t('seconds')
                : diffDays < 60 * 60
                    ? `${Math.floor(diffDays / 60)} ` + t('minutes')
                    : diffDays < 60 * 60 * 24
                        ? `${Math.floor(diffDays / (60 * 60))} ` + t('hours')
                        : diffDays < 60 * 60 * 24 * 30
                            ? `${Math.floor(diffDays / (60 * 60 * 24))} ` + t('days')
                            : diffDays < 60 * 60 * 24 * 30 * 12
                                ? `${Math.floor(diffDays / (60 * 60 * 24 * 30))} ` + t('months')
                                : `${Math.floor(diffDays / (60 * 60 * 24 * 30 * 12))} ` + t('years')
        }

        function imgFit(): string {
            return props.imageFit == 'crop' ? 'object-cover' : 'object-contain'
        }

        function statusClass(status: string): string {
            return status === "published" ? "color_primary" : status === "archived" ? "color_archire" : "color_sub"
        }

        const layoutComponent = computed(() => {
            const components = {
                1: 'itemOne',
                2: 'itemTwo',
                3: 'itemThree',
            }
            return components[props.size]
        })

        return {
            t,
            layoutComponent,
            selectionIcon,
            toggleSelection,
            handleClick,
            imgError,
            getItemValue,
            formatDate,
            imgFit,
            statusClass
        };
    },

});
</script>

<style lang="scss" scoped>
.loading {
    .header {
        margin-bottom: 8px;
    }
}

.card_img {
    wdith: 150px;
    object-fit: cover;
    height: 150px;
}

.card {
    position: relative;
    cursor: pointer;

    .header {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        overflow: hidden;
        background-color: var(--background-normal);
        border-color: var(--primary-50);
        border-style: solid;
        border-width: 0px;
        border-radius: var(--border-radius);
        transition: border-width var(--fast) var(--transition);

        &::after {
            display: block;
            padding-bottom: 100%;
            content: '';
        }

        .image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .svg {
            position: absolute;
            width: 75%;
            height: 75%;
            object-fit: contain;
        }

        .type {
            color: var(--foreground-subdued);
            text-transform: uppercase;
        }

        .v-icon {
            --v-icon-color: var(--foreground-subdued);
        }

        .v-skeleton-loader {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .selection-fade {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 48px;
            opacity: 0;
            transition: opacity var(--fast) var(--transition);

            &::before {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: linear-gradient(-180deg, rgb(38 50 56 / 0.1) 10%, rgb(38 50 56 / 0));
                content: '';
            }
        }
    }

    &::before {
        position: absolute;
        top: 7px;
        left: 7px;
        z-index: 2;
        width: 18px;
        height: 18px;
        background-color: var(--background-page);
        border-radius: 24px;
        opacity: 0;
        transition: opacity var(--fast) var(--transition);
        content: '';
    }

    .selector {
        --v-icon-color: var(--white);
        --v-icon-color-hover: var(--white);
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 3;
        margin: 4px;
        opacity: 0;
        transition: opacity var(--fast) var(--transition), color var(--fast) var(--transition);

        &:hover {
            opacity: 1 !important;
        }
    }

    &.select-mode {
        .selector {
            opacity: 0.5;
        }

        .header {
            .selection-fade {
                opacity: 1;
            }
        }
    }

    &.selected {
        &::before {
            opacity: 1;
        }

        .selector {
            --v-icon-color: var(--primary);
            --v-icon-color-hover: var(--primary);

            opacity: 1;
        }

        .header {
            border-width: 12px;

            .selection-fade {
                opacity: 1;
            }
        }
    }

    &:hover {
        .selector {
            opacity: 2;
        }

        .header {
            .selection-fade {
                opacity: 1;
            }
        }
    }
}

.readonly {
    pointer-events: none;
}

.title,
.subtitle {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 20px;
    margin-top: 2px;
    overflow: hidden;
    line-height: 1.3em;
    white-space: nowrap;
    text-overflow: ellipsis;

    :deep(.render-template) {
        height: 100%;
    }
}

.subtitle {
    margin-top: 0px;
    color: var(--foreground-subdued);
}
</style>

<template>
	<div class="d-flex-custom gap-6-6 ">
		<div class="card-img relative"  >
			<img :src="imageUrl() " :alt="title"  class="card-img-img" :class="[selectMode === 'check_circle' ? 'scale' : '',classImgFit]" @error="onErr($event)">
			<div class="card-abs" :class="selectMode === 'check_circle' ? 'outline' : ''"></div>
		</div>
		<div class="flex-1 gap-6">
			<render-template v-if="title" class="title" :collection="collection" :item="item" :template="title" />
			<render-template v-if="subtitle" class=" subtitle" :collection="collection" :item="item" :template="subtitle" />
			<render-template v-if="tag" class="tags" :collection="collection" :item="item" :template="tag" />
			<p class="d-flex items-center gap-2">
				<v-chip outlined x-small class="chip-id"  :class='statusClass' >{{ id }}</v-chip>
				<div class="dot-sub"></div>
				<v-icon small name="access_time"></v-icon>
				<render-template class="time" :collection="collection" :item="item" :template="`{{date_created}}`" />
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, defineComponent } from 'vue';

export default defineComponent({
	props: {
		collection: {
			default: null,
		},
		image: {
			type: String,
			default: null,
		},
		title: {
			type: String,
			default: "Title",
		},
		subtitle: {
			type: String,
			default: "Sub title",
		},
		tag:{
			type: String,
			default: null,
		},
		status:{
			type: String,
			default: null,
		},
		id:{
			default: null,
		},
		selectMode: {
			type: String,
			default: false,
		},
		classImgFit: {
			type: String,
			default: 'object-cover',
		},
		statusClass: {
			type: String,
			default: 'color_primary',
		},
		item: {
			type: Object,
			default: null,
		},
	
	
	},
	emits: [''],
	setup(props, { emit }) {
		const { t } = useI18n();
		const tags = computed(() => {
			if (props.tag) {
				return props.tag.split(',');
			}
			return [];
		});
		function getPublicURL(): string {
			return extract(window.location.href);
		}


		function extract(path: string) {
			const parts = path.split('/');
			const adminIndex = parts.indexOf('admin');
			const rootPath = parts.slice(0, adminIndex).join('/') + '/';
			return rootPath;
		}


		function imageUrl() {
			const assetUrl = new URL(`assets/${props.image}`, getPublicURL())
			return assetUrl.href;
		}
		

		function onErr(e:any){
			e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
		}
		return { t,tags, onErr,imageUrl };
	},
});
</script>

<style lang="scss" scoped>
.card .title{
	display: block;
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 8px;
    transition: all;
	display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card .subtitle{
	display: block;
    font-size: 1.1rem;
    color: var(--text-normal);
	display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 8px;

}
.card .time{
    font-size: 0.9rem;
    color: var(--text-normal);
}

.color_primary{
	--v-chip-color: var(--primary);
	border: 2px solid var(--v-chip-color);
}	
.color_disible{
	--v-chip-color: var(--border-normal);
	border: 2px solid var(--v-chip-color);
}	
.color_archire{
	--v-chip-color: rgb(255, 164, 57);
	border: 2px solid  rgb(255, 164, 57);
	background: var(--v-chip-color);
}

.card .tags{
	margin-bottom: 8px;
	height: 20px;
    padding: 0 4px;
    font-size: 12px;
	border-radius: var(--border-radius);
	display: inline-flex;
	background-color: var(--border-normal);
    align-items: center;
}
</style>
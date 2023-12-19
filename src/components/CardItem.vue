<template>
	<div class="d-flex-custom gap-6-6 ">
		<div class="card-img relative"  >
			<div  class="selection-fade"></div>
			<img 
				v-if="image"
				:src="imageUrl()" 
				:alt="title"  
				class="card-img-img" 
				:class="[selectMode === 'check_circle' ? 'scale' : '',classImgFit]" 
				@error="onErr($event)"
			>
			<div v-else class="icon-fall bg-not-thumbnail">
				<v-icon x-large name="image"></v-icon>
			</div>
			<div 
				class="card-abs" 
				:class="selectMode === 'check_circle' ? 'outline' : ''"></div>
		</div>
		<div class="flex-1 gap-6">
			<render-template 
				v-if="title" class="title" 
				:collection="collection" 
				:item="item" 
				:template="title" 
			/>
			<render-template 
				v-if="subtitle" 
				class="subtitle" 
				:collection="collection" 
				:item="item" 
				:template="subtitle" 
			/>
			<render-template 
				v-if="tag" 
				class="tags" 
				:collection="collection" 
				:item="item" 
				:template="tag" 
			/>
			<p class="d-flex w-full items-center gap-2">

				<v-chip 
					v-if="idShow"
					outlined 
					x-small 
					class="chip-id"  
					:class='statusClass' >{{ id }}</v-chip>
				<div v-if="idShow" class="dot-sub"></div>
				<v-icon small name="access_time"></v-icon>
				<render-template 
					class="time" 
					:collection="collection" 
					:item="item" 
					:template="`{{date_created}}`" 
				/>
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent,computed,watch,toRefs } from 'vue';
import { useSync } from '@directus/extensions-sdk';
export default defineComponent({
	props: {
		layoutOptions: {
            type: Object as PropType<LayoutOptions>,
            required: false,
        },
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
		idShow:{
			type: Boolean
		}
	
	
	},
	emits: [''],
	setup(props: any,{emit}) {
		const { t } = useI18n();
		const {  layoutOptions } = toRefs(props);
		
		function getPublicURL(): string {
			return extract(window.location.href);
		}

		function extract(path: string) {
			const parts = path.split('/');
			const adminIndex = parts.indexOf('admin');
			const rootPath = parts.slice(0, adminIndex).join('/') + '/';
			return rootPath;
		}

		function imageUrl():string {
			
			const assetUrl = props.image ? new URL(`assets/${props.image}`, getPublicURL()) : null;
			
			return assetUrl?.href ? `${assetUrl.href}?width=500&height=350` : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
		}
		
		function onErr(e:any){
			e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
		}
		return { t, onErr,imageUrl };
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
	margin-bottom: 6px;

}
.card .time{
    font-size: 0.9rem !important;
    color: var(--text-normal) !important;
	

}
.card .datetime{
	overflow: hidden;
    line-height: 1.15;
    white-space: initial !important;
    text-overflow: ellipsis;
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
    padding: 4px;
    font-size: 12px;
	border-radius: 4px;
	background-color: var(--border-normal);
	display: inline-block;
}

.dot-sub {
    width: 2px;
    height: 16px;
    border-radius: 1px;
    display: inline-block;
    background-color: var(--border-normal);
}
.icon-fall{
	position: absolute;
	width: 100%;
	inset: 0;
	display: flex;
	place-items: center;
	justify-content: center;
	z-index: 10;
}
.bg-not-thumbnail{
	position: absolute;
	width: 100%;
	inset: 0;
	z-index: 1;
	background-color: var(--background-highlight);
}
.icon-fall v-icon{
	font-size: 2rem;
	width: 50px;
	color: var(--text-normal);
}
.card-img .selection-fade{
	position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 48px;
    opacity: 0;
    transition: opacity var(--fast) var(--transition);
}
.card-img .selection-fade::before{
	position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(-180deg, rgba(38, 50, 56, 0.1) 10%, rgba(38, 50, 56, 0));
    content: "";
}
.card-img:hover .selection-fade{
	opacity: 1;
	transition: opacity var(--fast) var(--transition)
}
</style>
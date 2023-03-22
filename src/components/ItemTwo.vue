<template>
	<div class="flex gap-6 flex-title">
		<div class="card-img relative"  >
			<img :src="`/assets/${image}`" :alt="title"  class="card-img-img" :class="[selectMode === 'check_circle' ? 'scale' : '',classImgFit]" @error="onErr($event)">
			<div class="card-abs" :class="selectMode === 'check_circle' ? 'outline' : ''"></div>
		</div>
		<div class="flex-1 gap-6">
			<h2 class="title flex-1 text-2"><span class='dot mr-2' :class='statusClass' ></span> {{ title }}</h2>
			<p class="mb-2 text-3" v-html="subtitle"> </p>
			<div class="hidden-bar tags mb-2 max-h-12">
				<v-chip x-small class="mr-1" v-for="tag,index in tags" :key="index">{{ tag }}</v-chip>
			</div>
			<p class="flex items-center gap-2">
				<v-chip outlined x-small class="chip-id"  :class='statusClass' >{{ id }}</v-chip>
				<div class="dot-sub"></div>
				<v-icon small name="access_time"></v-icon>
				<span class="time">{{ dateCreated }}</span>
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, defineComponent } from 'vue';

export default defineComponent({
	props: {
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
		dateCreated:{
			type: String,
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
		statusClass:{
			type: String,
			default: 'color_primary',
		}
	
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

		function onErr(e:any){
			e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
		}

		return { t,tags,onErr };
	},
});
</script>

<style lang="scss" scoped>
.object-cover {
	object-fit: cover;
}
.object-contain {
	object-fit: contain;
}
.max-h-12{
	max-height: 48px;
	overflow: hidden;
}
.time{
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
	background-color: rgb(255, 164, 57);
}
.chip-id{
	background-color: var(--border-normal);
	color: var(--text-normal);
}
.flex{
	display: flex;	
}
.items-center{
	align-items: center;
}
.flex-1{
	flex: 1;
}
.mr-1 {
	margin-right: 4px;
}
.mr-2 {
	margin-right: 8px;
}
.title{
	font-size: 1.1rem;
	font-weight: bold;
	margin-bottom: 8px;
	transition: all;
}
.subtitle{
	font-size: 0.9rem;
	color: var(--text-normal);
}
.color_primary{
	background-color: var(--primary);
}
.color_sub{
	background-color: var(--border-normal);
}
.dot{
	width: 10px;
	height: 10px;
	border-radius: 50%;
	display: inline-block;
}
.dot-sub{
	width: 2px;
	height: 16px;
	border-radius: 1px;
	display: inline-block;
	background-color: var(--border-normal);
}
.mb-2{
	margin-bottom: 8px;
}
.mb-1{
	margin-bottom: 4px;
}
.text-2{
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}
.text-3{
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}
.card-img{
	width: 180px;
	height: 160px;
	object-fit: contain;
	border-radius: var(--border-radius);
	overflow: hidden;
}
.card-img-img{
	width: 100%;
	height: 100%;
	animation: scale2 0.05s ease-in-out forwards;
	background-color: var(--border-normal);

}

.gap-2{
	gap: 8px;
}
.gap-6{
	gap: 24px;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.hidden-bar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hidden-bar {
	width: 100%;
	overflow: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.relative{
	position: relative;
}
.outline{
	position: absolute;
	inset: 0;
	border-radius: var(--border-radius);
	overflow: hidden;
	box-shadow: inset 0 0 0 10px var(--primary-50) ;
	transition:  box-shadow 0.15s ease-in-out;
}
.scale{
	animation: scale 0.15s ease-in-out forwards;
}


@keyframes scale {
	0% {
		transform: scale(1);
	}
	100% {
		transform: scale(0.95);
	}
}
@keyframes scale2 {
	0% {
		transform: scale(0.95);
	}
	100% {
		transform: scale(1);
	}
}
.card:hover .title{
	color: var(--primary);
}
	
@media (max-width: 1024px) {
	.flex-title{
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-direction: column;
		-webkit-flex-direction: column;
		flex-direction: column;
	}
	.card-img{
		width: 100%;
		height: 180px;
	}
	.title{
		font-size: 1rem;
	}
	.subtitle{
		font-size: 0.8rem;
	}
	// .tags{
	// 	display: none;
	// }
	
}

</style>
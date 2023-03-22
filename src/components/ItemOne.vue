<template>
	<div class="flex gap-6">
		<div class="card-img relative" :class="classImgFit">
			<img :src="`/assets/${image}`" :alt="title"  class="card-img-img" :class="[selectMode === 'check_circle' ? 'scale' : '',classImgFit]" @error="onErr($event)">
			<div class="card-abs" :class="selectMode === 'check_circle' ? 'outline' : ''"></div>
		</div>
		<div class="flex-1 gap-6">
			<h2 class="title flex-1 text-2"> <span class='dot mr-2' :class='statusClass' ></span>{{ title }}</h2>
			<p class="mb-2 text-3" v-html="subtitle"> </p>
			<div class="mb-2 hidden-bar tags  max-h-12">
				<v-chip x-small class="mr-1 " v-for="tag,index in tags" :key="index">{{ tag }}</v-chip>
			</div>
			<p class="flex items-center gap-2">
				<v-chip outlined x-small class="chip-id"  :class='statusClass'>{{ id }}</v-chip>
				<div class="dot-sub"></div>
				<v-icon small name="access_time"></v-icon>
				<span class="time">{{ dateCreated }}</span>
			</p>
			<p>{{ status }}</p>
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
		statusClass: {
			type: String,
			default: 'color_primary',
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
		function onErr(e:any){
			e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
		}
		return { t,tags, onErr };
	},
});
</script>

<style lang="scss" scoped>

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

.title{
	font-size: 1.3rem;
	font-weight: bold;
	margin-bottom: 8px;
	transition: all;
}
.color_primary{
	background-color: var(--primary);
}
.color_sub{
	background-color: var(--border-normal);
}

.card-img{
	width: 290px;
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

.outline{
	position: absolute;
	inset: 0;
	border-radius: var(--border-radius);
	overflow: hidden;
	box-shadow: inset 0 0 0 10px var(--primary-50) ;
	transition:  box-shadow 0.15s ease-in-out;
}
	
@media (max-width: 768px) {
	.card-img{
		width: 180px;
		height: 120px;
	}
	.title{
		font-size: 1.2rem;
	}
	.subtitle{
		font-size: 0.9rem;
	}
	.tags{
		display: none;
	}
	
}

</style>
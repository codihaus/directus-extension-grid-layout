<template>
	<div
		class="card"
		:class="{
			loading,
			readonly,
			selected:
				item &&
				modelValue.includes(
					item[itemKey]
				),
			'select-mode': selectMode,
		}"
		@click="handleClick"
	>
		<v-icon
			class="selector"
			:name="selectionIcon"
			@click.stop="
				toggleSelection
			"
		/>
		<div :class="`card-${size}`">
			<card-item
				:id="item.id"
				:item="item"
				:collection="collection"
				:image="
					(imageSource &&
						imageSource?.id) ||
					null
				"
				:selectMode="
					selectionIcon
				"
				:title="title"
				:subtitle="subtitle"
				:tag="tag"
				:idShow="idShow"
				:statusClass="
					statusClass(
						item.status
					)
				"
				:classImgFit="imgFit()"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import {
	computed,
	defineComponent,
	PropType,
	ref,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import CardItem from "./CardItem.vue";
type File = {
	[key: string]: any;
	id: string;
	type: string;
	modified_on: Date;
};
export default defineComponent({
	components: { CardItem },
	props: {
		collection: {
			type: String,
		},
		icon: {
			type: String,
			default: "box",
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
			type: Object as PropType<
				Record<string, any>
			>,
			default: null,
		},
		modelValue: {
			type: Array as PropType<
				(string | number)[]
			>,
			default: () => [],
		},
		selectMode: {
			type: Boolean,
			default: false,
		},
		to: {
			type: String,
			default: "",
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
			default: "title",
		},
		subtitle: {
			type: String,
			default: "subtitle",
		},
		imageFit: {
			type: String,
		},
		tag: {
			type: String,
			default: false,
		},
		size: {
			type: Number,
			default: 1,
		},
		idShow: {
			type: Boolean,
		},
	},
	emits: ["update:modelValue"],
	setup(props, { emit }) {
		const router = useRouter();
		const imgError = ref(false);
		const { t } = useI18n();

		const selectionIcon = computed(
			() => {
				if (!props.item)
					return "radio_button_unchecked";

				return props.modelValue.includes(
					props.item[
						props.itemKey
					]
				)
					? "check_circle"
					: "radio_button_unchecked";
			}
		);

		function toggleSelection():
			| void
			| any {
			if (!props.item)
				return null;

			if (
				props.modelValue.includes(
					props.item[
						props.itemKey
					]
				)
			) {
				emit(
					"update:modelValue",
					props.modelValue.filter(
						(key) =>
							key !==
							props.item[
								props
									.itemKey
							]
					)
				);
			} else {
				emit(
					"update:modelValue",
					[
						...props.modelValue,
						props.item[
							props
								.itemKey
						],
					]
				);
			}
		}

		function handleClick(): void {
			if (
				props.selectMode ===
				true
			) {
				toggleSelection();
			} else {
				router.push(props.to);
			}
		}

		function imgFit(): string {
			return props.imageFit ==
				"crop"
				? "object-cover"
				: "object-contain";
		}

		function statusClass(
			status: string
		): string {
			return status ===
				"published"
				? "color_primary"
				: status === "archived"
				? "color_archire"
				: "color_sub";
		}

		return {
			t,
			selectionIcon,
			toggleSelection,
			handleClick,
			imgError,
			imgFit,
			statusClass,
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
		background-color: var(
			--background-normal
		);
		border-color: var(--primary-50);
		border-style: solid;
		border-width: 0px;
		border-radius: var(
			--border-radius
		);
		transition: border-width
			var(--fast)
			var(--transition);

		&::after {
			display: block;
			padding-bottom: 100%;
			content: "";
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
			color: var(
				--foreground-subdued
			);
			text-transform: uppercase;
		}

		.v-icon {
			--v-icon-color: var(
				--foreground-subdued
			);
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
			transition: opacity
				var(--fast)
				var(--transition);

			&::before {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-image: linear-gradient(
					-180deg,
					rgb(38 50 56 / 0.1)
						10%,
					rgb(38 50 56 / 0)
				);
				content: "";
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
		background-color: var(
			--background-page
		);
		border-radius: 24px;
		opacity: 0;
		transition: opacity var(--fast)
			var(--transition);
		content: "";
	}

	.selector {
		color: var(--v-icon-color);
		position: absolute;
		top: 0px;
		left: 0px;
		z-index: 11;
		margin: 4px;
		opacity: 0;
		transition: opacity var(--fast)
				var(--transition),
			color var(--fast)
				var(--transition);
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
			--v-icon-color: var(
				--primary
			);
			--v-icon-color-hover: var(
				--primary
			);

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

<template>
	<div class="grid-w-full">
		<div class="field">
			<div class="type-label">
				{{
					t(
						"layouts.cards.image_source"
					)
				}}
			</div>
			<v-select
				v-model="
					imageSourceWritable
				"
				show-deselect
				item-value="field"
				item-text="name"
				:items="fileFields"
			/>
		</div>

		<div class="field">
			<div class="type-label">
				{{
					t(
						"layouts.cards.title"
					)
				}}
			</div>

			<v-collection-field-template
				v-model="titleWritable"
				:collection="collection"
			/>
		</div>

		<div class="field">
			<div class="type-label">
				{{
					t(
						"layouts.cards.subtitle"
					)
				}}
			</div>
			<v-collection-field-template
				v-model="
					subtitleWritable
				"
				:collection="collection"
			/>
		</div>
		<div class="field">
			<div class="type-label">
				Content
			</div>
			<v-collection-field-template
				v-model="
					contentWritable
				"
				:collection="collection"
			/>
		</div>

		<div class="field">
			<div class="type-label">
				{{
					t(
						"layouts.kanban.tags"
					)
				}}
			</div>
			<v-collection-field-template
				v-model="tagWritable"
				:collection="collection"
			/>
		</div>

		<v-detail class="field">
			<template #title>{{
				t("advanced")
			}}</template>
			<div class="field">
				<v-checkbox
					v-model="
						checkIdShow
					"
					block
					:label="'Show Id'"
				></v-checkbox>
			</div>
			<div class="nested-options">
				<div class="field">
					<div
						class="type-label"
					>
						{{
							t(
								"layouts.cards.image_fit"
							)
						}}
					</div>
					<v-select
						v-model="
							imageFitWritable
						"
						:items="[
							{
								text: t(
									'layouts.cards.crop'
								),
								value: 'crop',
							},
							{
								text: t(
									'layouts.cards.contain'
								),
								value: 'contain',
							},
						]"
					/>
				</div>
			</div>
		</v-detail>
	</div>
</template>

<script lang="ts">
import { useI18n } from "vue-i18n";
import {
	defineComponent,
	ref,
} from "vue";
import { useSync } from "@directus/composables";

export default defineComponent({
	inheritAttrs: false,
	props: {
		collection: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
		fileFields: {
			type: Array,
			required: true,
		},
		imageSource: {
			type: String,
			default: null,
		},
		title: {
			type: String,
			default: null,
		},
		subtitle: {
			type: String,
			default: null,
		},
		content: {
			type: String,
			default: null,
		},
		imageFit: {
			type: String,
			required: true,
		},
		tag: {
			type: String,
			default: null,
		},
		idShow: {
			type: Boolean,
			default: true,
		},
	},

	setup(props, { emit }) {
		const { t } = useI18n();
		const layoutOptions = useSync(
			props,
			"layoutOptions",
			emit
		);

		const iconWritable = useSync(
			props,
			"icon",
			emit
		);
		const imageSourceWritable =
			useSync(
				props,
				"imageSource",
				emit
			);
		const titleWritable = useSync(
			props,
			"title",
			emit
		);
		const subtitleWritable =
			useSync(
				props,
				"subtitle",
				emit
			);
		const contentWritable =
			useSync(
				props,
				"content",
				emit
			);
		const imageFitWritable =
			useSync(
				props,
				"imageFit",
				emit
			);
		const tagWritable = useSync(
			props,
			"tag",
			emit
		);
		const checkIdShow = useSync(
			props,
			"idShow",
			emit
		);
		return {
			t,
			iconWritable,
			checkIdShow,
			imageSourceWritable,
			titleWritable,
			subtitleWritable,
			contentWritable,
			imageFitWritable,
			tagWritable,
		};
	},
});
</script>

<style lang="scss" scoped>
.grid-w-full {
	width: 100%;
	-ms-grid-column-span: 1 / -1;
	grid-column: 1 / -1;
}

.field {
	margin-top: 8px;
}
</style>

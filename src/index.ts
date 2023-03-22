import { useI18n } from 'vue-i18n';
import { useCollection, useItems, useSync } from '@directus/extensions-sdk';
import { defineLayout, getFieldsFromTemplate } from '@directus/shared/utils';
import { computed, ref, toRefs, Ref, unref } from 'vue';
import CardsActions from './actions.vue';
import CardsLayout from './cards.vue';
import CardsOptions from './options.vue';
import { LayoutOptions, LayoutQuery } from './types';

export default defineLayout<LayoutOptions, LayoutQuery>({
	id: 'item_blog',
	name: 'Grid View',
	icon: 'grid_4',
	component: CardsLayout,
	slots: {
		options:   CardsOptions,
		sidebar: () => undefined,
		actions:  CardsActions,
	},
	setup(props, { emit }) {
		const selection = useSync(props, 'selection', emit);
		const layoutOptions = useSync(props, 'layoutOptions', emit);
		const layoutQuery = useSync(props, 'layoutQuery', emit);

		const { collection, filter, search, filterUser } = toRefs(props);

		const { info, primaryKeyField, fields: fieldsInCollection } = useCollection(collection);

		const { size, icon, imageSource, title, subtitle, imageFit,tag } = useLayoutOptions();

		const { sort, limit, page, fields } = useLayoutQuery();


		const fileFields = computed(() => {
			return fieldsInCollection.value
		});

		const { items, loading, error, totalPages, itemCount, totalCount, getItems, getTotalCount, getItemCount } =
			useItems(collection, {
				sort,
				limit,
				page,
				fields,
				filter,
				search,
			});

		function formatCollectionItemsCount(
				totalItems: number,
				currentPage: number,
				perPage: number,
				isFiltered = false
			) {
				const { t, n } = useI18n();

				const opts = {
					start: n((+currentPage - 1) * perPage + 1),
					end: n(Math.min(currentPage * perPage, totalItems || 0)),
					count: n(totalItems || 0),
				};

				if (isFiltered) {
					if (totalItems === 1) {
						return t('one_filtered_item');
					}

					return t('start_end_of_count_filtered_items', opts);
				}

				if (totalItems > perPage) {
					return t('start_end_of_count_items', opts);
				}

				return t('item_count', { count: totalItems });
			}

		const showingCount = computed(() => {
			const filtering = Boolean((itemCount.value || 0) < (totalCount.value || 0) && filterUser.value);
			return formatCollectionItemsCount(itemCount.value || 0, page.value, limit.value, filtering);
		});

		function syncRefProperty<R, T extends keyof R>(ref: Ref<R>, key: T, defaultValue: R[T] | Ref<R[T]>) {
			return computed<R[T]>({
				get() {
					return ref.value?.[key] ?? unref(defaultValue);
				},
				set(value: R[T]) {
					ref.value = Object.assign({}, ref.value, { [key]: value }) as R;
				},
			});
		}


		const width = ref(0);

		const isSingleRow = computed(() => {
			const cardsWidth = items.value.length * (size.value * 40) + (items.value.length - 1) * 24;
			return cardsWidth <= width.value;
		});


		function clone(value: any): any {
			if (typeof value === "object" && value !== null) {
			if (Array.isArray(value)) {
			return (value.map((item) => clone(item)) as unknown) as any;
			} else {
			const newObj = {} as any;
			for (let prop in value) {
				newObj[prop] = clone(value[prop]);
				}
				return newObj;
				}
			}
			return value;
		}

		async function resetPresetAndRefresh() {
			await props?.resetPreset?.();
			refresh();
		}

		function refresh() {
			getItems();
			getTotalCount();
			getItemCount();
		}



		function toPage(newPage: number) {
			page.value = newPage;
		}

		function useLayoutOptions() {
			const size = createViewOption<number>('size', 1);
			const icon = createViewOption<string>('icon', 'box');
			const title = createViewOption<string | null>('title', null);
			const subtitle = createViewOption<string | null>('subtitle', null);
			const imageSource = createViewOption<string | null>('imageSource', null);
			const imageFit = createViewOption<string>('imageFit', 'cover');
			const tag = createViewOption<string>('tag',null);

			return { size, icon, imageSource, title, subtitle, imageFit,tag };

			function createViewOption<T>(key: keyof LayoutOptions, defaultValue: any) {
				return computed<T>({
					get() {
						return layoutOptions.value?.[key] !== undefined ? layoutOptions.value?.[key] : defaultValue;
					},
					set(newValue: T) {
						layoutOptions.value = {
							...layoutOptions.value,
							[key]: newValue,
						};
					},
				});
			}
		}

		function useLayoutQuery() {
			const page = syncRefProperty(layoutQuery, 'page', 1);
			const limit = syncRefProperty(layoutQuery, 'limit', 25);
			const defaultSort = computed(() => (primaryKeyField.value ? [primaryKeyField.value?.field] : []));
			const sort = syncRefProperty(layoutQuery, 'sort', defaultSort);

			const fields = computed<string[]>(() => {
				if (!primaryKeyField.value || !props.collection) return [];
				const fields = [primaryKeyField.value.field];

				if (imageSource.value) {
					fields.push(`${imageSource.value}.modified_on`);
					fields.push(`${imageSource.value}.type`);
					fields.push(`${imageSource.value}.filename_disk`);
					fields.push(`${imageSource.value}.storage`);
					fields.push(`${imageSource.value}.id`);
				}

				if (props.collection === 'directus_files' && imageSource.value === '$thumbnail') {
					fields.push('modified_on');
					fields.push('type');
				}

				const titleSubtitleFields: string[] = [];

				if (title.value) {
					titleSubtitleFields.push(...getFieldsFromTemplate(title.value));
				}

				if (subtitle.value) {
					titleSubtitleFields.push(...getFieldsFromTemplate(subtitle.value));
				}
				if (tag.value) {
					titleSubtitleFields.push(...getFieldsFromTemplate(tag.value));
				}

				titleSubtitleFields.push('status')
				titleSubtitleFields.push('date_created')

				return [...fields,...titleSubtitleFields];
			});

			return { sort, limit, page, fields };
		}

		function getLinkForItem(item: Record<string, any>) {
			if (!primaryKeyField.value) return;
			return `/content/${props.collection}/${encodeURIComponent(item[primaryKeyField.value.field])}`;
		}

		function selectAll() {
			if (!primaryKeyField.value) return;
			const pk = primaryKeyField.value;
			selection.value = clone(items.value)?.map((item:any) => item[pk.field]);
		}


return {
	fileFields,
	items,
	loading,
	error,
	totalPages,
	page,
	toPage,
	itemCount,
	totalCount,
	fieldsInCollection,
	limit,
	size,
	primaryKeyField,
	icon,
	imageSource,
	tag,
	title,
	subtitle,
	getLinkForItem,
	imageFit,
	sort,
	info,
	showingCount,
	isSingleRow,
	width,
	refresh,
	selectAll,
	resetPresetAndRefresh,
	filter,
	search,

};


	},
});

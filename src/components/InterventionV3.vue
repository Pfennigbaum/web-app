<template>
  <problem-summary-container class="intervention">
    <q-tabs
      v-model="selectedCategory"
      no-caps
      class="bg-intervention text-white q-mb-xs radius-md shadow-2"
    >
      <q-tab
        :name="category.code"
        :label="($q.screen.gt.xs ? category.title : '') + (false && interventionsInCategory(category.code).length ? ' (' + interventionsInCategory(category.code).length + ')' : '')"
        :icon="category.icon"
        v-for="(category, index) in categories"
        v-bind:key="index"
      >
        <q-badge
          color="white"
          floating
          :label="interventionsInCategory(category.code).length"
          v-if="true && interventionsInCategory(category.code).length"
          class="radius-lg text-intervention text-weight-medium"
        />
      </q-tab>
    </q-tabs>
    <q-tab-panels
      v-model="selectedCategory"
      animated
    >
      <q-tab-panel
        :name="category.code"
        v-for="(category, index) in categories"
        v-bind:key="index"
      >
        <div class="q-gutter-md">
          <div class="text-subtitle1 text-center category-header">
            <simplified-markdown
              v-if="interventionsInSelectedCategory.length"
              :text="$t('interventionsForCategoryTitle', {category: category.title, problem: $t(record.problem.title)}) + ':'"
            />
            <simplified-markdown
              v-else
              :text="$t('noPlannedInterventionsForCategoryTitle', {category: category.title})"
              class="text-body2"
            />
          </div>
          <intervention-editor
            v-for="intervention in interventionsInSelectedCategory"
            :key="intervention.id"
            :value="intervention"
            @delete="deleteIntervention(intervention.id)"
            @duplicate="duplicateIntervention(intervention.id)"
            class="editable-intervention q-px-md q-pt-sm q-pb-xs bg-intervention-light radius-md shadow-2"
          />
          <div class="column items-center">
            <q-btn
              icon="add"
              color="intervention"
              :label="$t('addIntervention')"
              rounded
              class="shadow-1 q-mt-md"
              @click="addIntervention"
            />
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </problem-summary-container>
</template>

<style lang="sass">
.intervention
  .q-tab__label
    white-space: normal
    line-height: 1.2rem
    margin-top: 4px
  .q-tab-panel
    @media (max-width: $breakpoint-xs-max)
      padding-left: 4px
      padding-right: 4px
  .category-header
    @media (max-width: $breakpoint-xs-max)
      line-height: 1.2rem
      &> *
        font-size: .8rem
    .text-bold
      white-space: nowrap
      &:nth-of-type(2)
        color: var(--q-color-intervention)
        font-size: 110%
        @media (max-width: $breakpoint-xs-max)
          font-size: 125%
      &:nth-of-type(4)
        color: var(--q-color-classification)
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { TerminologyWithMaps } from "../helper/terminology";
import { ProblemRecord } from "../models/problemRecord";
import { Intervention } from "../models/intervention";
import InterventionEditor from "./InterventionEditorV3.vue";
import ProblemSummaryContainer from "components/ProblemSummaryContainer.vue";
import SimplifiedMarkdown from "components/SimplifiedMarkdown.vue";

@Component({
  components: {
    InterventionEditor,
    ProblemSummaryContainer,
    SimplifiedMarkdown
  }
})
export default class InterventionView extends Vue {
  selectedCategory = "01";

  get interventions() {
    return this.record?.interventions || [];
  }
  set interventions(interventions) {
    const changes: any = {};
    const key: keyof ProblemRecord = "interventions";
    changes[key] = interventions;
    this.$store.direct.commit.updateObject({
      target: this.record,
      changes: changes
    });
  }
  get categories() {
    return this.terminology.interventionScheme.categories;
  }
  get interventionsInSelectedCategory() {
    return this.interventionsInCategory(this.selectedCategory);
  }
  get terminology() {
    return (this.$t("terminology") as unknown) as TerminologyWithMaps;
  }
  get record() {
    return this.$store.direct.getters.getProblemRecordById(this.$route.params);
  }

  interventionsInCategory(categoryCode: string) {
    return this.interventions.filter(
      intervention => intervention.categoryCode == categoryCode
    );
  }
  addIntervention() {
    const intervention = new Intervention();
    intervention.categoryCode = this.selectedCategory;
    const interventions = this.interventions.slice();
    interventions.push(intervention);
    this.interventions = interventions;
  }
  deleteIntervention(id: string) {
    const index = this.interventions.findIndex(item => item.id == id);
    if (index >= 0) {
      const interventions = this.interventions.slice();
      interventions.splice(index, 1);
      this.interventions = interventions;
    }
  }
  duplicateIntervention(id: string) {
    const index = this.interventions.findIndex(item => item.id == id);
    const intervention = this.interventions[index]?.clone();
    if (intervention) {
      const interventions = this.interventions.slice();
      interventions.splice(index + 1, 0, intervention);
      this.interventions = interventions;
    }
  }
}
</script>

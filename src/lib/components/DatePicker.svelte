<script lang="ts">
  import type { DateValue } from "@internationalized/date";
  import { getLocalTimeZone } from "@internationalized/date";
  import { ArrowLeft, ArrowRight, Calendar } from "@lucide/svelte";
  import { DatePicker } from "bits-ui";

  type Props = {
    value?: DateValue;
    label: string;
    onchange: (timestamp: number) => void;
    error: string;
    name: string;
  };

  let {
    value = $bindable(undefined),
    label,
    onchange,
    error,
    name,
  }: Props = $props();

  function onValueChange(value: DateValue | undefined) {
    // eslint-disable-next-line antfu/if-newline
    if (!value) return;

    const date = value.toDate(getLocalTimeZone()).getTime();

    onchange(date);
  }
</script>

<DatePicker.Root
  bind:value
  {onValueChange}
  weekdayFormat="short"
  fixedWeeks={true}
>
  <div class="flex w-full flex-col gap-1.5">
    <DatePicker.Label class="block select-none text-xs">
      {label}
    </DatePicker.Label>
    <DatePicker.Input
      class="flex items-center border border-surface-200-800 p-1 rounded"
    >
      {#snippet children({ segments })}
        {#each segments as { part, value }, i (part + i)}
          <div class="inline-block select-none">
            {#if part === "literal"}
              <DatePicker.Segment {part} class="p-1">
                {value}
              </DatePicker.Segment>
            {:else}
              <DatePicker.Segment {part} class="rounded px-1 py-1">
                {value}
              </DatePicker.Segment>
            {/if}
          </div>
        {/each}
        <DatePicker.Trigger
          class="ml-auto inline-flex size-8 items-center justify-center rounded-[5px] transition-all"
        >
          <Calendar size={16} />
        </DatePicker.Trigger>
      {/snippet}
    </DatePicker.Input>
    <DatePicker.Content sideOffset={6} class="z-50">
      <DatePicker.Calendar
        class="rounded-[15px] border p-[22px] bg-surface-800"
      >
        {#snippet children({ months, weekdays })}
          <DatePicker.Header class="flex items-center justify-between">
            <DatePicker.PrevButton
              class="inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
            >
              <ArrowLeft size={16} />
            </DatePicker.PrevButton>
            <DatePicker.Heading class="text-[15px] font-medium" />
            <DatePicker.NextButton
              class="inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
            >
              <ArrowRight size={16} />
            </DatePicker.NextButton>
          </DatePicker.Header>
          <div
            class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
          >
            {#each months as month (month.value)}
              <DatePicker.Grid
                class="w-full border-collapse select-none space-y-1"
              >
                <DatePicker.GridHead>
                  <DatePicker.GridRow class="mb-1 flex w-full justify-between">
                    {#each weekdays as day (day)}
                      <DatePicker.HeadCell
                        class="text-surface-900 font-normal! w-10 rounded-md text-xs"
                      >
                        <div>{day.slice(0, 2)}</div>
                      </DatePicker.HeadCell>
                    {/each}
                  </DatePicker.GridRow>
                </DatePicker.GridHead>
                <DatePicker.GridBody>
                  {#each month.weeks as weekDates (weekDates)}
                    <DatePicker.GridRow class="flex w-full">
                      {#each weekDates as date (date)}
                        <DatePicker.Cell
                          {date}
                          month={month.value}
                          class="p-0! relative size-10 text-center text-sm"
                        >
                          <DatePicker.Day
                            class="hover:border-surface-900 data-selected:bg-surface-900 data-disabled:text-surface-900 data-selected:text-primary-500 data-unavailable:text-surface-900 data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal transition-all"
                          >
                            <div
                              class="group-data-today:block absolute top-[5px] hidden size-1 rounded-full transition-all"
                            ></div>
                            {date.day}
                          </DatePicker.Day>
                        </DatePicker.Cell>
                      {/each}
                    </DatePicker.GridRow>
                  {/each}
                </DatePicker.GridBody>
              </DatePicker.Grid>
            {/each}
          </div>
        {/snippet}
      </DatePicker.Calendar>
    </DatePicker.Content>
    {#if error}
      <span id={`${name}-error`} class="text-xs text-error-500">
        {error}
      </span>
    {/if}
  </div>
</DatePicker.Root>

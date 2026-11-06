"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseIcon,
  CodeXmlIcon,
  FileTextIcon,
  LayersIcon,
  ListOrderedIcon,
  Loader2Icon,
  type LucideIcon,
  MessagesSquareIcon,
  UsersIcon,
} from "lucide-react";
import { type ReactNode, useId } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { RadioGroupField } from "@/shared/forms/RadioGroupField";
import { SelectField } from "@/shared/forms/SelectField";
import { SliderField } from "@/shared/forms/SliderField";
import { TextAreaField } from "@/shared/forms/TextAreaField";

import {
  DEFAULT_START_VALUES,
  INTERVIEW_TYPE_LABELS,
  INTERVIEW_TYPE_OPTIONS,
  JOB_DESCRIPTION_MAX_LENGTH,
  LEVEL_LABELS,
  LEVEL_OPTIONS,
  MAX_QUESTION_COUNT,
  MIN_QUESTION_COUNT,
  ROLE_LABELS,
  ROLE_OPTIONS,
} from "@/modules/interviews/constants";
import { startInterviewFormSchema } from "@/modules/interviews/schemas/interviews.schema";
import type {
  StartInterviewFieldErrors,
  StartInterviewFormValues,
  StartInterviewRequest,
} from "@/modules/interviews/types/interviews.types";
import { formatQuestionCount } from "@/modules/interviews/utils/format.utils";

type InterviewConfigFormProps = {
  isPending: boolean;
  /** Resolves with field errors to show, or nothing on success / when the error was already toasted. */
  onSubmit: (request: StartInterviewRequest) => Promise<StartInterviewFieldErrors | void>;
};

const TYPE_ICONS = { technical: CodeXmlIcon, behavioral: UsersIcon, mixed: LayersIcon };
const TYPE_OPTIONS = INTERVIEW_TYPE_OPTIONS.map((option) => ({ ...option, icon: TYPE_ICONS[option.value] }));

const notChosen = <span className="font-normal text-muted-foreground">Not chosen</span>;

/** Presentational setup screen: the form plus a live summary with the Start button. The container starts the interview. */
export function InterviewConfigForm({ isPending, onSubmit }: InterviewConfigFormProps) {
  const formId = useId();
  const form = useForm<StartInterviewFormValues, unknown, StartInterviewRequest>({
    resolver: zodResolver(startInterviewFormSchema),
    defaultValues: DEFAULT_START_VALUES,
    mode: "onTouched",
  });
  const { errors, isSubmitting } = form.formState;
  const isBusy = isPending || isSubmitting;
  const [role, level, interviewType, questionCount, jobDescription] = useWatch({
    control: form.control,
    name: ["role", "level", "interview_type", "question_count", "job_description"],
  });
  const jobDescriptionLength = jobDescription?.length ?? 0;

  const submit = form.handleSubmit(async (request) => {
    const fieldErrors = await onSubmit(request);
    if (!fieldErrors) {
      return;
    }
    for (const [field, message] of Object.entries(fieldErrors) as [keyof StartInterviewFormValues, string][]) {
      form.setError(field, { message }, { shouldFocus: true });
    }
  });

  const summaryItems = [
    { label: "Role", value: role ? ROLE_LABELS[role] : notChosen },
    { label: "Level", value: level ? LEVEL_LABELS[level] : notChosen },
    { label: "Style", value: interviewType ? INTERVIEW_TYPE_LABELS[interviewType] : notChosen },
    { label: "Length", value: formatQuestionCount(questionCount) },
    { label: "Job description", value: jobDescription?.trim() ? "Added" : notChosen },
  ];

  return (
    // Form plus a sticky summary from `xl` (the sidebar takes ~16rem); stacked, form first, below that.
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      {/* @container: the grid follows the form column's width (which the sidebar and summary panel squeeze), not the viewport. */}
      <form id={formId} noValidate onSubmit={submit} aria-busy={isBusy} className="@container min-w-0">
        <FieldSet disabled={isBusy} className="grid min-w-0 gap-6 @2xl:grid-cols-2">
          <SectionCard
            icon={BriefcaseIcon}
            title="Role & level"
            description="The job you're interviewing for and your experience."
          >
            <SelectField
              name="role"
              label="Role"
              control={form.control}
              options={ROLE_OPTIONS}
              placeholder="Select a role"
              fullWidth
              error={errors.role?.message}
            />
            <RadioGroupField
              name="level"
              label="Level"
              control={form.control}
              options={LEVEL_OPTIONS}
              variant="segmented"
              disabled={isBusy}
              error={errors.level?.message}
            />
          </SectionCard>

          <SectionCard
            icon={ListOrderedIcon}
            title="Length"
            description="A few for a quick warm-up, more for a full mock interview."
          >
            <SliderField
              name="question_count"
              label="Number of questions"
              control={form.control}
              min={MIN_QUESTION_COUNT}
              max={MAX_QUESTION_COUNT}
              formatValue={formatQuestionCount}
              disabled={isBusy}
              error={errors.question_count?.message}
            />
          </SectionCard>

          <SectionCard
            icon={MessagesSquareIcon}
            title="Interview style"
            description="What kind of questions you want to practice."
            className="@2xl:col-span-2"
          >
            <RadioGroupField
              name="interview_type"
              label="Question type"
              control={form.control}
              options={TYPE_OPTIONS}
              variant="cards"
              disabled={isBusy}
              error={errors.interview_type?.message}
            />
          </SectionCard>

          <SectionCard
            icon={FileTextIcon}
            title="Job description"
            description="Paste the posting to get questions closer to the real role."
            badge={<Badge variant="outline">Optional</Badge>}
            className="@2xl:col-span-2"
          >
            <TextAreaField
              name="job_description"
              label="Job posting"
              placeholder="Paste the job posting here"
              rows={5}
              className="min-h-32"
              register={form.register}
              error={errors.job_description?.message}
              description={
                <span className="flex justify-between gap-4">
                  <span>Used only to tailor your questions.</span>
                  <span
                    className={cn(
                      "shrink-0 tabular-nums",
                      jobDescriptionLength > JOB_DESCRIPTION_MAX_LENGTH && "text-destructive",
                    )}
                  >
                    {jobDescriptionLength} / {JOB_DESCRIPTION_MAX_LENGTH}
                  </span>
                </span>
              }
            />
          </SectionCard>
        </FieldSet>
      </form>
      {/* Offset by the sticky app header so the panel never slides under it. */}
      <aside
        aria-label="Interview summary"
        className="flex flex-col gap-6 xl:sticky xl:top-[calc(var(--app-header-height)+1.5rem)]"
      >
        <Card>
          <CardHeader>
            <CardTitle>
              <h2 className="text-base font-semibold">Summary</h2>
            </CardTitle>
            <CardDescription>Check your choices before you start.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm">
              {summaryItems.map((item) => (
                <div key={item.label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">{item.label}</dt>
                  <dd className="text-right font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-3">
            <Button type="submit" form={formId} size="lg" className="h-11 w-full" disabled={isBusy}>
              {isBusy && <Loader2Icon aria-hidden className="animate-spin motion-reduce:animate-none" />}
              {isBusy ? "Preparing your questions…" : "Start AI Interview"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">You can end the interview at any time.</p>
          </CardFooter>
        </Card>
      </aside>
    </div>
  );
}

type SectionCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Shown beside the title, e.g. an "Optional" badge. */
  badge?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** One category of the setup form, as its own card in the setup grid. */
function SectionCard({ icon: Icon, title, description, badge, className, children }: SectionCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent">
          <Icon aria-hidden className="size-5 text-primary-text" />
        </span>
        <div className="flex flex-col gap-1">
          <CardTitle className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">{title}</h3>
            {badge}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">{children}</CardContent>
    </Card>
  );
}

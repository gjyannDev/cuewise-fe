"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseIcon,
  CodeXmlIcon,
  FileTextIcon,
  LayersIcon,
  ListOrderedIcon,
  Loader2Icon,
  MessagesSquareIcon,
  UsersIcon,
} from "lucide-react";
import { useId } from "react";
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
} from "../constants";
import { startInterviewFormSchema } from "../schemas/interviews.schema";
import type {
  StartInterviewFieldErrors,
  StartInterviewFormValues,
  StartInterviewRequest,
} from "../types/interviews.types";
import { formatQuestionCount } from "../utils/format-question-count";
import { InterviewColumns } from "./InterviewColumns";
import { InterviewDetailList } from "./InterviewDetailList";
import { SetupSectionCard } from "./SetupSectionCard";

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

  const summary = (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-base font-semibold">Summary</h2>
        </CardTitle>
        <CardDescription>Check your choices before you start.</CardDescription>
      </CardHeader>
      <CardContent>
        <InterviewDetailList
          items={[
            { label: "Role", value: role ? ROLE_LABELS[role] : notChosen },
            { label: "Level", value: level ? LEVEL_LABELS[level] : notChosen },
            { label: "Style", value: interviewType ? INTERVIEW_TYPE_LABELS[interviewType] : notChosen },
            { label: "Length", value: formatQuestionCount(questionCount) },
            { label: "Job description", value: jobDescription?.trim() ? "Added" : notChosen },
          ]}
        />
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <Button type="submit" form={formId} size="lg" className="h-11 w-full" disabled={isBusy}>
          {isBusy && <Loader2Icon aria-hidden className="animate-spin motion-reduce:animate-none" />}
          {isBusy ? "Preparing your questions…" : "Start AI Interview"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">You can end the interview at any time.</p>
      </CardFooter>
    </Card>
  );

  return (
    <InterviewColumns aside={summary} asideLabel="Interview summary">
      {/* @container: the grid follows the form column's width (which the sidebar and summary panel squeeze), not the viewport. */}
      <form id={formId} noValidate onSubmit={submit} aria-busy={isBusy} className="@container">
        <FieldSet disabled={isBusy} className="grid min-w-0 gap-6 @2xl:grid-cols-2">
          <SetupSectionCard
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
          </SetupSectionCard>

          <SetupSectionCard
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
          </SetupSectionCard>

          <SetupSectionCard
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
          </SetupSectionCard>

          <SetupSectionCard
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
          </SetupSectionCard>
        </FieldSet>
      </form>
    </InterviewColumns>
  );
}

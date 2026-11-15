"use client";

import { Loader2Icon, Trash2Icon } from "lucide-react";
import { type ReactNode, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { RESUME_PROFILE_COPY } from "@/modules/profile/constants";
import type { Profile } from "@/modules/profile/types/profile.types";

type ResumeProfileViewProps = {
  profile: Profile;
  isDeleting: boolean;
  /** Another action on the profile is running (an upload), so Delete waits. */
  disabled?: boolean;
  onDelete: () => void;
};

/** A run of short items set like a résumé line: "Python · FastAPI · PostgreSQL". */
const DOT_LIST = "flex flex-wrap gap-y-1 [&>li:not(:last-child)]:after:mx-2 [&>li:not(:last-child)]:after:text-muted-foreground [&>li:not(:last-child)]:after:content-['·']";

/**
 * What cuewise-be understood from the résumé, laid out like a résumé page so the candidate can check it before an
 * interview uses it. There is no name or contact header: the profile never holds them, by design. Every value came
 * from a model reading an uploaded file, so it is rendered as plain text only. Empty sections are left out, and keys
 * add the index because the model's lists aren't guaranteed to be free of repeats.
 */
export function ResumeProfileView({ profile, isDeleting, disabled = false, onDelete }: ResumeProfileViewProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const updated = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(profile.updated_at));

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <CardTitle>
            <h2 className="text-base font-semibold">{RESUME_PROFILE_COPY.title}</h2>
          </CardTitle>
          <CardDescription>
            {RESUME_PROFILE_COPY.description} Updated {updated}.
          </CardDescription>
        </div>

        {/* Radix returns focus to the trigger when the dialog closes. */}
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogTrigger asChild>
            {/* Soft destructive: red enough to read as "removes something", quiet enough not to compete with the page. */}
            <Button
              variant="outline"
              className="h-11 gap-2 rounded-lg border-destructive/30 px-4 text-destructive shadow-none transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive/30 dark:border-destructive/40 dark:hover:bg-destructive/15"
              disabled={isDeleting || disabled}
            >
              {isDeleting ? (
                <Loader2Icon aria-hidden className="animate-spin motion-reduce:animate-none" />
              ) : (
                <Trash2Icon aria-hidden />
              )}
              {isDeleting ? "Deleting…" : "Delete profile"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{RESUME_PROFILE_COPY.deleteTitle}</DialogTitle>
              <DialogDescription>{RESUME_PROFILE_COPY.deleteDescription}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="h-11">
                  Keep it
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                className="h-11"
                onClick={() => {
                  setIsConfirmOpen(false);
                  onDelete();
                }}
              >
                Delete profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* The "page": a document surface inside the card, like a printed résumé. */}
        <article
          aria-label="Your résumé profile"
          className="flex flex-col gap-8 rounded-lg border bg-background px-5 py-6 shadow-sm sm:px-10 sm:py-10"
        >
          {profile.roles.length > 0 && (
            <ResumeSection title="Experience">
              <ol className="flex flex-col gap-6">
                {profile.roles.map((role, index) => (
                  <li key={`${role.title}-${index}`} className="flex flex-col gap-1.5">
                    <div className="flex flex-col gap-x-4 gap-y-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                      <h4 className="text-base font-semibold">{role.title}</h4>
                      {role.period && (
                        <p className="shrink-0 text-sm text-muted-foreground tabular-nums">{role.period}</p>
                      )}
                    </div>
                    {role.organization && <p className="text-sm font-medium text-muted-foreground">{role.organization}</p>}
                    {role.summary && <p className="text-sm leading-relaxed">{role.summary}</p>}
                  </li>
                ))}
              </ol>
            </ResumeSection>
          )}

          {profile.projects.length > 0 && (
            <ResumeSection title="Projects">
              <ul className="flex flex-col gap-6">
                {profile.projects.map((project, index) => (
                  <li key={`${project.name}-${index}`} className="flex flex-col gap-1.5">
                    <h4 className="text-base font-semibold">{project.name}</h4>
                    {project.description && <p className="text-sm leading-relaxed">{project.description}</p>}
                    {project.technologies.length > 0 && (
                      <ul aria-label={`Technologies used in ${project.name}`} className={`${DOT_LIST} text-sm text-muted-foreground`}>
                        {project.technologies.map((technology, techIndex) => (
                          <li key={`${technology}-${techIndex}`}>{technology}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </ResumeSection>
          )}

          {profile.skills.length > 0 && (
            <ResumeSection title="Skills">
              <ul className={`${DOT_LIST} text-sm leading-relaxed`}>
                {profile.skills.map((skill, index) => (
                  <li key={`${skill}-${index}`}>{skill}</li>
                ))}
              </ul>
            </ResumeSection>
          )}
        </article>

        <p className="text-xs text-muted-foreground">{RESUME_PROFILE_COPY.missingHint}</p>
      </CardContent>
    </Card>
  );
}

/** One résumé section: a small-caps heading over a rule, then its entries. */
function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <h3
        id={headingId}
        className="border-b pb-2 text-xs font-semibold tracking-[0.18em] text-primary-text uppercase"
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

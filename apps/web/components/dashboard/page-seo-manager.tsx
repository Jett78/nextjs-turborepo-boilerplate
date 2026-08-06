"use client";

import { FileText } from "lucide-react";
import type { PageSeo } from "@/types/page-seo";
import Link from "next/link";
import { EditButton } from "@/components/dashboard/edit-button";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { API_ROUTES } from "@/config/api-routes";

interface PageSeoManagerProps {
  pages: PageSeo[];
}

export function PageSeoManager({ pages }: PageSeoManagerProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6">
          {pages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-foreground mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No page SEO entries yet</p>
              <p className="text-xs text-slate-400">Click "Add Page SEO" to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primarymain/30 hover:bg-primarymain/5 transition-all group"
                >
                  <Link
                    href={`/dashboard/page-seo/${page.pagePath}/edit`}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-primarymain/10 transition-colors">
                      <FileText className="h-4 w-4 text-slate-500 group-hover:text-primarymain" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{page.pageTitle || page.pagePath}</p>
                      <p className="text-xs text-slate-500 font-mono">{page.pagePath}</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <EditButton href={`/dashboard/page-seo/${page.pagePath}/edit`} />
                    <DeleteButton
                      id={page.pagePath}
                      endpoint={API_ROUTES.PAGE_SEO}
                      queryKey="page-seo"
                      entityName="page SEO"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

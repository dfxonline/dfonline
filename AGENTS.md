<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep home city-news selection in a browser-safe pure helper sorting the DF feed by publication timestamps, including items with no detected RA, so selection is testable and does not hide local reporting.
- Resolve news labels in a browser-safe pure helper shared by cards, rows and headlines; prefer a uniquely identified city, then feed category or conservative text-based topic detection, to keep presentation consistent without changing imports.
- Use the existing Embla-backed carousel controls for the home headline sequence, keeping article links separate from navigation controls for accessible browsing and touch support.

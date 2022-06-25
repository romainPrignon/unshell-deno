release: ## make release version=0.1.2
	git tag -a v${version} -m "🔖 Release v${version}" && git push --follow-tags

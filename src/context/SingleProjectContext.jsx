import { useState, createContext, useEffect } from 'react';
import { singleProjectData as singleProjectDataJson } from '../data/singleProjectData';
import { projectsData } from '../data/projects';

const SingleProjectContext = createContext();

export const SingleProjectProvider = ({ children, projectId }) => {
	const [singleProjectData, setSingleProjectData] = useState(
		singleProjectDataJson
	);

	useEffect(() => {
		if (projectId) {
			// Find the project data based on the projectId
			const project = projectsData.find(p => p.id === parseInt(projectId));
			if (project) {

				const techsBlock = Array.isArray(project.techs) && project.techs.length
					? [{ title: 'Tools & Technologies', techs: project.techs }]
					: singleProjectDataJson.ProjectInfo?.Technologies || [];

				const detailsBlock = Array.isArray(project.details) && project.details.length
					? project.details.map((text, idx) => ({ id: idx + 1, details: text }))
					: singleProjectDataJson.ProjectInfo?.ProjectDetails || [];

				const imagesArray = Array.isArray(project.images) && project.images.length
					? project.images.map((img, idx) => ({
						id: idx + 1,
						title: project.title,
						img,
						}))
					: [{ id: 1, title: project.title, img: project.img }];

				const projectSpecificData = {
					...singleProjectDataJson,
					ProjectHeader: {
						...singleProjectDataJson.ProjectHeader,
						title: project.ProjectHeader?.title || project.title,
						publishDate: project.ProjectHeader?.publishDate || 'Recent',
						tags: project.ProjectHeader?.tags || project.category,
					},
					ProjectImages: [
						{
							id: 1,
							title: project.title,
							img: project.img,
						},
						...singleProjectDataJson.ProjectImages.slice(1), // Keep other images from template
					],
					ProjectImages: imagesArray,
					ProjectInfo: {
						...singleProjectDataJson.ProjectInfo,
						Technologies: techsBlock,
						ProjectDetails: detailsBlock,
					},
				};
				setSingleProjectData(projectSpecificData);
			}
		}
	}, [projectId]);

	return (
		<SingleProjectContext.Provider
			value={{ singleProjectData, setSingleProjectData }}
		>
			{children}
		</SingleProjectContext.Provider>
	);
};

export default SingleProjectContext;
